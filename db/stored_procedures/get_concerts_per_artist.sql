DROP PROCEDURE IF EXISTS GetConcertsPerArtist;
DELIMITER //

CREATE PROCEDURE GetConcertsPerArtist(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        CONCAT(a.artist_first_name, ' ', a.artist_last_name) AS artist_name,
        COUNT(*) AS concert_count
    FROM api_concert c
    JOIN api_artist a ON c.artist_id = a.id
    WHERE c.concert_date BETWEEN p_start_date AND p_end_date
    GROUP BY a.id;
END //

DELIMITER ;