DELIMITER //

CREATE PROCEDURE sign_up(
    IN p_login VARCHAR(50),
    IN p_password VARCHAR(255)
)
BEGIN
    INSERT INTO users (login, password) VALUES (p_login, p_password);
END //

DELIMITER ;