DELIMITER //

CREATE PROCEDURE check_user(IN login VARCHAR(50))
BEGIN
    SELECT id FROM users WHERE login = login;
END //

CREATE PROCEDURE sign_up(
    IN login VARCHAR(50),
    IN password VARCHAR(255)
)
BEGIN
    INSERT INTO users (login, password) VALUES (login, password);
END //

CREATE PROCEDURE login (
    IN login VARCHAR(50),
    OUT userPassword VARCHAR(255)
)
BEGIN
    SELECT password INTO userPassword FROM users WHERE login = login;
END //

CREATE PROCEDURE getCode(IN language VARCHAR(50))
    BEGIN
    DECLARE result_json JSON;
    
    SELECT text INTO result_json FROM Dictionary WHERE name = language;
    
    SELECT result_json AS json_result;
    
    END //

    CREATE PROCEDURE saveSessionData(
    IN p_username VARCHAR(255),
    IN p_selectLang VARCHAR(255),
    IN p_attemptTime INT,
    IN p_totalTime INT
)
BEGIN
    INSERT INTO session_data (username, selectLang, attemptTime, totalTime)
    VALUES (p_username, p_selectLang, p_attemptTime, p_totalTime);
END //

DELIMITER ;