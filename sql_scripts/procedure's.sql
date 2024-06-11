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
    IN p_attemptTime TIMESTAMP, -- дата и время попытки
    IN p_username VARCHAR(255),
    IN p_selectLang VARCHAR(255),
    IN p_timeSpent TIME, -- затраченное время
    IN p_speed DOUBLE -- скорость
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_dict_id INT;

    SELECT id INTO v_user_id FROM users WHERE login = p_username LIMIT 1;
    SELECT id INTO v_dict_id FROM dictionary WHERE name = p_selectLang LIMIT 1;

    INSERT INTO approach (date, time, idUser, idDict, inClass, speed)
    VALUES (p_attemptTime, p_timeSpent, v_user_id, v_dict_id, 1, p_speed);
END //

DELIMITER ;