DROP PROCEDURE IF EXISTS GetConcertsPerArtist;
DROP PROCEDURE IF EXISTS GetConcertsByFilters;
DROP PROCEDURE IF EXISTS GetConcertsPerOrganizer;
DROP PROCEDURE IF EXISTS GetConcertsPerLocation;
DELIMITER //

CREATE PROCEDURE GetConcertsPerLocation(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        CONCAT(l.city, ', ', l.country) AS location_name,
        COUNT(*) AS concert_count,
        ROUND(AVG(c.duration_minutes), 2) AS avg_duration_minutes
    FROM api_concert c
    JOIN api_location l ON c.location_id = l.id
    WHERE
        (p_start_date IS NULL OR c.concert_date >= p_start_date) AND
        (p_end_date IS NULL OR c.concert_date <= p_end_date)
    GROUP BY l.id;
END //

CREATE PROCEDURE GetConcertsPerOrganizer(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        CONCAT(o.organizer_first_name, ' ', o.organizer_last_name) AS organizer_name,
        COUNT(*) AS concert_count,
        ROUND(AVG(c.duration_minutes), 2) AS avg_duration_minutes
    FROM api_concert c
    JOIN api_organizer o ON c.organizer_id = o.id
    WHERE
        (p_start_date IS NULL OR c.concert_date >= p_start_date) AND
        (p_end_date IS NULL OR c.concert_date <= p_end_date)
    GROUP BY o.id;
END //

CREATE PROCEDURE GetConcertsPerArtist(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        CONCAT(a.artist_first_name, ' ', a.artist_last_name) AS artist_name,
        COUNT(*) AS concert_count,
        ROUND(AVG(c.duration_minutes), 2) AS avg_duration_minutes
    FROM api_concert c
    JOIN api_artist a ON c.artist_id = a.id
    WHERE
        (p_start_date IS NULL OR c.concert_date >= p_start_date) AND
        (p_end_date IS NULL OR c.concert_date <= p_end_date)
    GROUP BY a.id;
END //

CREATE PROCEDURE GetConcertsByFilters(
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_artist_id CHAR(36),
    IN p_organizer_id CHAR(36),
    IN p_location_id CHAR(36)
)
BEGIN
    SELECT
        c.id AS concert_id,
        c.concert_date,
        c.concert_time,
        c.duration_minutes,
        CONCAT(a.artist_first_name, ' ', a.artist_last_name) AS artist_name,
        CONCAT(ag.agent_first_name, ' ', ag.agent_last_name) AS agent_name,
        CONCAT(o.organizer_first_name, ' ', o.organizer_last_name) AS organizer_name,
        CONCAT(l.city, ', ', l.country) AS location_name
    FROM api_concert c
    JOIN api_artist a ON c.artist_id = a.id
    LEFT JOIN api_agent ag ON a.agent_id = ag.id
    JOIN api_organizer o ON c.organizer_id = o.id
    JOIN api_location l ON c.location_id = l.id
    WHERE
        (p_start_date IS NULL OR c.concert_date >= p_start_date) AND
        (p_end_date IS NULL OR c.concert_date <= p_end_date) AND
        (p_artist_id IS NULL OR c.artist_id = p_artist_id) AND
        (p_organizer_id IS NULL OR c.organizer_id = p_organizer_id) AND
        (p_location_id IS NULL OR c.location_id = p_location_id)
    ORDER BY c.concert_date ASC;
END //

DELIMITER ;
