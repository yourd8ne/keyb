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

CREATE PROCEDURE getCodes(IN dictionaryName VARCHAR(50))
BEGIN
    DECLARE id_Dictionary INT;
    DECLARE id_Language INT;
    DECLARE studentCodeLimit INT;

    -- Получаем id словаря, язык и количество кодов для студента
    SELECT idDictionary, Languages_idLanguage, NumberOfCodesForStudent
    INTO id_Dictionary, id_Language, studentCodeLimit
    FROM Dictionaries
    WHERE Name = dictionaryName
    LIMIT 1;

    -- Проверка, что словарь найден
    IF id_Dictionary IS NOT NULL THEN
        -- Проверка, что количество кодов для студента не NULL
        IF studentCodeLimit IS NOT NULL THEN
            -- Возвращаем случайные строки из словаря
            SELECT dc.Code, l.HighlightName, dc.idCode
            FROM Dictionary_Codes dc
            JOIN Languages l ON l.idLanguage = id_Language
            WHERE dc.Dictionaries_idDictionary = id_Dictionary
            ORDER BY RAND()
            LIMIT studentCodeLimit;
        ELSE
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'NumberOfCodesForStudent is NULL';
        END IF;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Dictionary not found';
    END IF;
END //

CREATE PROCEDURE getDictionaryIdByName(
    IN p_selectedDict VARCHAR(255)
)
BEGIN
    SELECT idDictionary FROM Dictionaries WHERE name = p_selectedDict;
END //

CREATE PROCEDURE getDictionariesInfo()
BEGIN
    SELECT Name FROM Dictionaries;
END //

CREATE PROCEDURE saveSessionData(
    IN attemptTime TIMESTAMP,
    IN username VARCHAR(255),
    IN selectedDict VARCHAR(255),
    IN timeSpent DOUBLE,
    IN speed DOUBLE,
    IN userNumberOfCharacters INT,
    IN userNumberOfSnippets INT,
    IN dirtinessIndex DOUBLE,
    IN backspaceCount INT
)
BEGIN
    DECLARE userId INT;
    DECLARE dictId INT;

    -- Поиск идентификатора пользователя
    SELECT idUsers INTO userId
    FROM Users
    WHERE Login = username
    LIMIT 1;

    -- Если пользователь не найден, выбрасываем ошибку
    IF userId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Пользователь не найден';
    END IF;

    -- Поиск идентификатора словаря
    SELECT idDictionary INTO dictId
    FROM Dictionaries
    WHERE Name = selectedDict
    LIMIT 1;

    -- Если словарь не найден, выбрасываем ошибку
    IF dictId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Словарь не найден';
    END IF;

    -- Вставка данных о попытке
    INSERT INTO Attempts (
        Date, 
        Time, 
        idUser, 
        idDictionary, 
        inClass, 
        Speed, 
        UserNumberOfCharacters, 
        UserNumberOfSnippets,
        DirtinessIndex,
        BackspaceCount
    )
    VALUES (
        attemptTime, 
        SEC_TO_TIME(timeSpent), 
        userId, 
        dictId, 
        1, 
        speed, 
        userNumberOfCharacters, 
        userNumberOfSnippets,
        dirtinessIndex,
        backspaceCount
    );
END //

CREATE PROCEDURE saveCodeForSession(
    IN idAttempts INT,        -- ID попытки (получается из результата saveSessionData)
    IN dictId INT,            -- ID словаря (получается из saveSessionData)
    IN idCodes TEXT           -- Массив ID кодов (формат: '1,2,3') для вставки
)
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE curCode INT;
    DECLARE pos INT DEFAULT 1;
    DECLARE codeLength INT;
    
    -- Получаем длину строки
    SET codeLength = LENGTH(idCodes);
    
    -- Цикл для извлечения каждого кода
    read_loop: LOOP
        -- Находим позицию следующей запятой (или конца строки)
        SET pos = LOCATE(',', idCodes);
        
        -- Если запятая найдена, извлекаем подстроку до нее
        IF pos > 0 THEN
            SET curCode = CAST(SUBSTRING(idCodes, 1, pos - 1) AS UNSIGNED);
            SET idCodes = SUBSTRING(idCodes, pos + 1);
        ELSE
            -- Если запятая не найдена, значит, это последний код
            SET curCode = CAST(idCodes AS UNSIGNED);
            SET done = 1;
        END IF;
        
        -- Вставка в таблицу Attempts_Codes для каждого кода
        INSERT INTO Attempts_Codes (idAttempts, idDictionary, idCode)
        VALUES (idAttempts, dictId, curCode);

        -- Если строка заканчена, выходим из цикла
        IF done THEN
            LEAVE read_loop;
        END IF;
    END LOOP;
END //


-- Получение всех попыток
CREATE PROCEDURE getAttempts()
BEGIN
    SELECT
        a.idUser,
        a.Date,
        a.Time,
        u.Login AS UserName,
        d.Name AS DictionaryName,
        a.inClass,
        ROUND(a.Speed, 2) AS Speed,
        a.UserNumberOfCharacters,
        a.UserNumberOfSnippets,
        a.DirtinessIndex,
        a.BackspaceCount
    FROM
        Attempts a
    LEFT JOIN
        Users u ON a.idUser = u.idUsers
    LEFT JOIN
        Dictionaries d ON a.idDictionary = d.idDictionary;
END //

CREATE PROCEDURE `GetUserStats`(IN p_user_id INT)
BEGIN
    DECLARE user_exists INT;
    DECLARE total_attempts INT;

    SELECT COUNT(*) INTO user_exists FROM Users WHERE idUsers = p_user_id;
    
    IF user_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User not found';
    ELSE
        SET SESSION group_concat_max_len = 1000000;
        
        SELECT 
            COUNT(*) AS attempts_count,
            AVG(Speed) AS mean_speed,
            MAX(Speed) AS max_speed,
            (
                SELECT AVG(Speed)
                FROM (
                    SELECT Speed, @rownum := @rownum + 1 AS row_number
                    FROM Attempts, (SELECT @rownum := 0) r
                    WHERE idUser = p_user_id
                    ORDER BY Speed
                ) AS sorted
                WHERE row_number IN (FLOOR((total + 1)/2), FLOOR((total + 2)/2))
            ) AS median_speed,
            -- Остальные перцентили (с оговорками)
            (
                SUBSTRING_INDEX(SUBSTRING_INDEX(GROUP_CONCAT(Speed ORDER BY Speed), ',', CEIL(COUNT(*) * 0.95)), ',', -1)
            ) AS percentile_95,
            (
                SUBSTRING_INDEX(SUBSTRING_INDEX(GROUP_CONCAT(Speed ORDER BY Speed), ',', CEIL(COUNT(*) * 0.75)), ',', -1)
            ) AS quartile_3,
            AVG(UserNumberOfCharacters) AS avg_chars,
            AVG(UserNumberOfSnippets) AS avg_snippets,
            SUM(inClass = 1) AS in_class_count
        FROM Attempts
        CROSS JOIN (SELECT COUNT(*) AS total FROM Attempts WHERE idUser = p_user_id) AS t
        WHERE idUser = p_user_id;
    END IF;
END //
DELIMITER ;