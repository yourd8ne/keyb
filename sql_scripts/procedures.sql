DELIMITER //

-- Проверка существования пользователя
CREATE PROCEDURE check_user(IN name VARCHAR(50), OUT userExists INT)
BEGIN
    DECLARE countUsers INT;

    SELECT COUNT(*) INTO countUsers
    FROM Users
    WHERE Login = name;

    IF countUsers > 0 THEN
        SET userExists = 1;
    ELSE
        SET userExists = 0;
    END IF;
END //

-- Регистрация нового пользователя
CREATE PROCEDURE sign_up(
    IN p_login VARCHAR(50),
    IN p_password VARCHAR(255)
)
BEGIN
    INSERT INTO Users (Login, Password) VALUES (p_login, p_password);
END //

-- Вход пользователя
CREATE PROCEDURE login(IN p_login VARCHAR(50), OUT p_userPassword VARCHAR(255))
BEGIN
    SELECT Password INTO p_userPassword
    FROM Users
    WHERE Login = p_login
    LIMIT 1;
END //

-- Получение кода на основе языка
CREATE PROCEDURE getCode(IN dictionaryName VARCHAR(50))
BEGIN
    DECLARE id_Dictionary INT;
    DECLARE id_Language INT;

    -- Получаем id словаря по его имени
    SELECT idDictionary, Languages_idLanguage INTO id_Dictionary, id_Language
    FROM Dictionaries
    WHERE Name = dictionaryName
    LIMIT 1;

    -- Проверка, что словарь найден
    IF id_Dictionary IS NOT NULL THEN
        -- Получаем код из таблицы Dictionary_Codes и HighliteName из таблицы Languages
        SELECT dc.Code, l.HighliteName
        FROM Dictionary_Codes dc
        JOIN Languages l ON l.idLanguage = id_Language
        WHERE dc.Dictionaries_idDictionary = id_Dictionary;
    ELSE
        -- Возвращаем ошибку, если словарь не найден
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Dictionary not found';
    END IF;
END //

-- Получение списка языков
CREATE PROCEDURE getLang()
BEGIN
    SELECT Name FROM Dictionaries;
END //

-- Сохранение данных о попытке
CREATE PROCEDURE saveSessionData(
    IN attemptTime TIMESTAMP,
    IN username VARCHAR(255),
    IN selectLang VARCHAR(255),
    IN timeSpent TIME,
    IN speed DOUBLE
)
BEGIN
    DECLARE userId INT;
    DECLARE dictId INT;

    -- Поиск идентификатора пользователя
    SELECT idUsers INTO userId FROM Users WHERE Login = username LIMIT 1;

    -- Проверка существования пользователя
    IF userId IS NULL THEN
        SET userId = 0; -- Или другое действие, так как MyISAM не поддерживает SIGNAL
    END IF;

    -- Поиск идентификатора словаря
    SELECT idDictionary INTO dictId 
    FROM Dictionaries d
    JOIN Languages l ON d.Languages_idLanguage = l.idLanguage
    WHERE l.Name = selectLang
    LIMIT 1;

    -- Проверка существования словаря
    IF dictId IS NULL THEN
        SET dictId = 0; -- Или другое действие
    END IF;

    -- Вставка данных о попытке
    INSERT INTO Attempt (Date, Time, idUser, idDict, inClass, Speed)
    VALUES (attemptTime, timeSpent, userId, dictId, 1, speed);

    -- Вывод для диагностики (можно убрать позже)
    SELECT userId, dictId;
END //

-- Получение всех попыток
CREATE PROCEDURE getAttempt()
BEGIN
    SELECT * FROM Attempt;
END //

DELIMITER ;
