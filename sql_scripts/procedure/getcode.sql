DELIMITER //

CREATE PROCEDURE getCode(IN language VARCHAR(50))
BEGIN
    DECLARE result_json JSON;
    
    SELECT text INTO result_json FROM Dictionary WHERE name = language;
    
    SELECT result_json AS json_result;
    
END //

DELIMITER ;