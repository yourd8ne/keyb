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

CREATE PROCEDURE getCodes(IN dictionaryName VARCHAR(50), IN numberOfCodes INT)
BEGIN
    DECLARE id_Dictionary INT;
    DECLARE id_Language INT;
    
    IF numberOfCodes <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid numberOfCodes value';
    END IF;

    -- Получаем id словаря по его имени
    SELECT idDictionary, Languages_idLanguage INTO id_Dictionary, id_Language
    FROM Dictionaries
    WHERE Name = dictionaryName
    LIMIT 1;

    -- Проверка, что словарь найден
    IF id_Dictionary IS NOT NULL THEN
        -- Нужно получить помимо кода и его хайлайтнейма, случайный набор из данных, где имя словаря совпадает с нашим
        SELECT dc.Code, l.HighlightName, dc.idCode
        FROM Dictionary_Codes dc
        JOIN Languages l ON l.idLanguage = id_Language
        WHERE dc.Dictionaries_idDictionary = id_Dictionary
        ORDER BY RAND()
        LIMIT numberOfCodes;
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
    SELECT Name, NumberOfCodes FROM Dictionaries;
END //

CREATE PROCEDURE saveSessionData(
    IN attemptTime TIMESTAMP,
    IN username VARCHAR(255),
    IN selectedDict VARCHAR(255),
    IN timeSpent DOUBLE,
    IN speed DOUBLE,
    IN userNumberOfCharacters INT,
    IN userNumberOfSnippets INT
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
    INSERT INTO Attempts (Date, Time, idUser, idDictionary, inClass, Speed, UserNumberOfCharacters, UserNumberOfSnippets)
    VALUES (attemptTime, SEC_TO_TIME(timeSpent), userId, dictId, 1, speed, userNumberOfCharacters, userNumberOfSnippets);
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
        a.UserNumberOfSnippets
    FROM
        Attempts a
    JOIN
        Users u ON a.idUser = u.idUsers
    JOIN
        Dictionaries d ON a.idDictionary = d.idDictionary;
END //


CREATE PROCEDURE getNumberOfCodes()
BEGIN
SELECT Value FROM GlobalSettings WHERE SettingName = 'NumberOfCodes';
END //


CREATE PROCEDURE `GetUserStats`(IN p_user_id INT)
BEGIN
    DECLARE user_exists INT;
    
    -- Проверяем существование пользователя
    SELECT COUNT(*) INTO user_exists FROM Users WHERE idUsers = p_user_id;
    
    IF user_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User not found';
    ELSE
        -- Основной запрос для расчёта статистики
        SELECT 
            COUNT(*) AS attempts_count,
            AVG(Speed) AS mean_speed,
            MAX(Speed) AS max_speed,
            
            -- Медиана (50-й перцентиль)
            (
                SELECT SUBSTRING_INDEX(
                    SUBSTRING_INDEX(
                        GROUP_CONCAT(Speed ORDER BY Speed SEPARATOR ','),
                        ',',
                        CEIL(COUNT(*) * 0.5)
                    ),
                    ',',
                    -1
                )
                FROM Attempts
                WHERE idUser = p_user_id
            ) AS median_speed,
            
            -- 95-й перцентиль
            (
                SELECT SUBSTRING_INDEX(
                    SUBSTRING_INDEX(
                        GROUP_CONCAT(Speed ORDER BY Speed SEPARATOR ','),
                        ',',
                        CEIL(COUNT(*) * 0.95)
                    ),
                    ',',
                    -1
                )
                FROM Attempts
                WHERE idUser = p_user_id
            ) AS percentile_95,
            
            -- 3-й квартиль (75-й перцентиль)
            (
                SELECT SUBSTRING_INDEX(
                    SUBSTRING_INDEX(
                        GROUP_CONCAT(Speed ORDER BY Speed SEPARATOR ','),
                        ',',
                        CEIL(COUNT(*) * 0.75)
                    ),
                    ',',
                    -1
                )
                FROM Attempts
                WHERE idUser = p_user_id
            ) AS quartile_3,
            
            AVG(UserNumberOfCharacters) AS avg_chars,
            AVG(UserNumberOfSnippets) AS avg_snippets,
            SUM(CASE WHEN inClass = 1 THEN 1 ELSE 0 END) AS in_class_count
        FROM Attempts
        WHERE idUser = p_user_id;
    END IF;
END //

DELIMITER ;

----
-- Языки, словари, коды..
DELIMITER //


INSERT INTO GlobalSettings (`SettingName`, `Value`)
VALUES ('NumberOfCodes', 3);

UPDATE GlobalSettings SET `Value` = 4 WHERE `SettingName` = 'NumberOfCodes';

INSERT INTO Languages (Name, HighlightName) VALUES ('Python', 'python');
INSERT INTO Languages (Name, HighlightName) VALUES ('C++', 'cpp');

INSERT INTO Dictionaries (Name, Languages_idLanguage, NumberOfCodes) VALUES ('simplePythonClass', 1, 1);
INSERT INTO Dictionaries (Name, Languages_idLanguage, NumberOfCodes) VALUES ('baseCppCodes', 2, 10);
INSERT INTO Dictionaries (Name, Languages_idLanguage, NumberOfCodes) VALUES ('sklearnExamples', 1, 15);

INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (1, 'class Dog:\n  def __init__(self, name):\n    self.name = name\n  def bark(self):\n    print(f"{self.name} says woof!")');

INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (2, 'int result = a + b * c;');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (2, 'std::vector<int> numbers = {1, 2, 3, 4, 5};');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (2, 'std::cout << "Hello, world!" << std::endl;');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (2, 'for (int i = 0; i < 10; i++) std::cout << i << " ";');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (2, 'double area = 3.14 * radius * radius;');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (2, 'std::string name = "John";');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (2, 'if (x > y) std::swap(x, y);');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (2, 'bool isEven = (num % 2 == 0);');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (2, 'std::map<std::string, int> score;');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (2, 'const int MAX_SIZE = 100;');

INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'import matplotlib.pyplot as plt');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'SVC(kernel="linear", C=0.025, random_state=42),');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'X += 2 * rng.uniform(size=X.shape)');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'figure = plt.figure(figsize=(27, 9))');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'cm_bright = ListedColormap(["#FF0000", "#0000FF"])');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'for name, clf in zip(names, classifiers):');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'score = clf.score(X_test, y_test)');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'clf = make_pipeline(StandardScaler(), clf)');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'lw_mse[i, j] = lw.error_norm(real_cov, scaling=False)');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'oa_shrinkage = np.zeros((n_samples_range.size, repeat))');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'plt.plot(X_test, y_1, color="cornflowerblue", label="max_depth=2", linewidth=2)');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'import matplotlib.pyplot as plt');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'y[::5, :] += 0.5 - rng.rand(20, 2)');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'X = np.sort(200 * rng.rand(100, 1) - 100, axis=0)');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'train_ax.scatter(X_train[:, 0], X_train[:, 1], c=y_train)');


//
DELIMITER ;