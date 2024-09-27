DELIMITER //

CREATE PROCEDURE login(IN p_login VARCHAR(50), OUT p_userPassword VARCHAR(255))
BEGIN
    SELECT password INTO p_userPassword
    FROM users
    WHERE login = p_login
    LIMIT 1; -- Гарантирует, что будет возвращена только одна строка
END //

DELIMITER ;