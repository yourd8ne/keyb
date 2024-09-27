DELIMITER //

CREATE PROCEDURE check_user(IN name VARCHAR(50), OUT userExists INT)
BEGIN
    DECLARE countUsers INT;
    
    SELECT COUNT(*) INTO countUsers
    FROM users
    WHERE login = name;

    IF countUsers > 0 THEN
        SET userExists = 1;
    ELSE
        SET userExists = 0;
    END IF;
END //

DELIMITER ;