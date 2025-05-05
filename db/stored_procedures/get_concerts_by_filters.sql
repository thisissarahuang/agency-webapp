DELIMITER //

CREATE PROCEDURE GetConcertsByFilters(
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_artist_id CHAR(36),
    IN p_organizer_id CHAR(36),
    IN p_location_id CHAR(36)
)
BEGIN
    SELECT
        c.concert_id,
        c.concert_date,
        c.concert_time,
        CONCAT(a.artist_first_name, ' ', a.artist_last_name) AS artist_name,
        CONCAT(o.organizer_first_name, ' ', o.organizer_last_name) AS organizer_name,
        CONCAT(l.city, ', ', l.country) AS location_name
    FROM api_concert c
    JOIN api_artist a ON c.artist_id = a.id
    JOIN api_organizer o ON c.organizer_id = o.id
    JOIN api_location l ON c.location_id = l.id
    WHERE
        (p_start_date IS NULL OR c.concert_date >= p_start_date) AND
        (p_end_date IS NULL OR c.concert_date <= p_end_date) AND
        (p_artist_id IS NULL OR c.artist_id = p_artist_id) AND
        (p_organizer_id IS NULL OR c.organizer_id = p_organizer_id) AND
        (p_location_id IS NULL OR c.location_id = p_location_id);
END //

DELIMITER ;
