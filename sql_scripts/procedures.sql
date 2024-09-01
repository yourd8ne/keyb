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

CREATE PROCEDURE sign_up(
    IN p_login VARCHAR(50),
    IN p_password VARCHAR(255)
)
BEGIN
    INSERT INTO users (login, password) VALUES (p_login, p_password);
END //

CREATE PROCEDURE login(IN p_login VARCHAR(50), OUT p_userPassword VARCHAR(255))
BEGIN
    SELECT password INTO p_userPassword
    FROM users
    WHERE login = p_login
    LIMIT 1; -- Гарантирует, что будет возвращена только одна строка
END //

CREATE PROCEDURE getCode(IN language VARCHAR(50))
BEGIN
    DECLARE result_json JSON;
    
    SELECT text INTO result_json FROM Dictionary WHERE name = language;
    
    SELECT result_json AS json_result;
    
END //

CREATE PROCEDURE getLang()
BEGIN

SELECT name FROM dictionary;

END //

CREATE PROCEDURE saveSessionData(
    IN attemptTime TIMESTAMP,  -- дата и время попытки
    IN username VARCHAR(255),
    IN selectLang VARCHAR(255),
    IN timeSpent TIME,  -- затраченное время
    IN speed DOUBLE  -- скорость
)
BEGIN
    DECLARE userId INT;
    DECLARE dictId INT;

    -- Поиск идентификатора пользователя
    SELECT id INTO userId FROM users WHERE login = username LIMIT 1;
    
    -- Проверка существования пользователя
    IF userId IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User not found';
    END IF;
    
    -- Поиск идентификатора словаря
    SELECT id INTO dictId FROM dictionary WHERE name = selectLang LIMIT 1;
    
    -- Проверка существования словаря
    IF dictId IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Dictionary not found';
    END IF;

    -- Вставка данных в таблицу подходов
    INSERT INTO attempt (date, time, idUser, idDict, inClass, speed)
    VALUES (attemptTime, timeSpent, userId, dictId, 1, speed);
END //

CREATE PROCEDURE getAttempt()
BEGIN

SELECT * FROM attempt;

END //
DELIMITER ;