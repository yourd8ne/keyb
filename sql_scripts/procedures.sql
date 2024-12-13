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
        SELECT dc.Code, l.HighlightName
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
    IN dictNumberOfCharacters INT,
    IN userNumberOfCharacters INT
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
    INSERT INTO Attempts (Date, Time, idUser, idDictionary, inClass, Speed, DictNumberOfCharacters, UserNumberOfCharacters)
    VALUES (attemptTime, SEC_TO_TIME(timeSpent), userId, dictId, 1, speed, dictNumberOfCharacters, userNumberOfCharacters);
END //


-- Получение всех попыток
CREATE PROCEDURE getAttempts()
BEGIN
    SELECT
        a.Date,
        a.Time,
        u.Login AS UserName,
        d.Name AS DictionaryName,
        a.inClass,
        ROUND(a.Speed, 2) AS Speed,
        a.numberOfCharacters
    FROM
        Attempt a
    JOIN
        Users u ON a.idUser = u.idUsers
    JOIN
        Dictionaries d ON a.idDictionary = d.idDictionary;
END //

CREATE PROCEDURE insertCode(
    IN dictName VARCHAR(255),    -- Имя словаря
    IN codeText TEXT             -- Текст кода
)
BEGIN
    DECLARE dictId INT;

    -- Поиск идентификатора словаря по имени
    SELECT idDictionary INTO dictId
    FROM Dictionaries
    WHERE Name = dictName
    LIMIT 1;

    -- Если словарь не найден, выбрасываем ошибку
    IF dictId IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Словарь не найден';
    ELSE
        -- Вставка кода в таблицу Dictionary_Codes
        INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code)
        VALUES (dictId, codeText);
    END IF;
END //

CREATE PROCEDURE insertOrCreateCode(
    IN dictName VARCHAR(255),      -- Имя словаря
    IN langId INT,                 -- Идентификатор языка
    IN codeText TEXT               -- Текст кода
)
BEGIN
    DECLARE dictId INT;

    -- Поиск идентификатора словаря по имени
    SELECT idDictionary INTO dictId
    FROM Dictionaries
    WHERE Name = dictName
    LIMIT 1;

    -- Если словарь не найден, создаем новый
    IF dictId IS NULL THEN
        INSERT INTO Dictionaries (Name, Languages_idLanguage)
        VALUES (dictName, langId);

        -- Получаем id вновь созданного словаря
        SET dictId = LAST_INSERT_ID();
    END IF;

    -- Вставка кода в таблицу Dictionary_Codes
    INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code)
    VALUES (dictId, codeText);
END //


DELIMITER ;
----
-- Языки, словари, коды..
insert into Languages (Name, HighlightName) values ('Python', 'python');
insert into Languages (Name, HighlightName) values ('C++', 'cpp');



insert into Dictionaries (Name, Languages_idLanguage, NumberOfCodes) values ('simplePythonClass', 1, 1);
insert into Dictionaries (Name, Languages_idLanguage, NumberOfCodes) values ('baseCppCodes', 2, 10);



insert into Dictionary_Codes (Dictionaries_idDictionary, Code) values (1, 'class Dog:\n  def __init__(self, name):\n    self.name = name\n  def bark(self):\n    print(f"{self.name} says woof!)');


insert into Dictionary_Codes (Dictionaries_idDictionary, Code) values (2, 'int result = a + b * c;'); 

insert into Dictionary_Codes (Dictionaries_idDictionary, Code) values (2, 'std::vector<int> numbers = {1, 2, 3, 4, 5};');

insert into Dictionary_Codes (Dictionaries_idDictionary, Code) values (2, 'std::cout << "Hello, world!" << std::endl;'); 

insert into Dictionary_Codes (Dictionaries_idDictionary, Code) values (2, 'for (int i = 0; i < 10; i++) std::cout << i << " ";'); 

insert into Dictionary_Codes (Dictionaries_idDictionary, Code) values (2, 'double area = 3.14 * radius * radius;'); 

insert into Dictionary_Codes (Dictionaries_idDictionary, Code) values (2, 'std::string name = "John";'); 

insert into Dictionary_Codes (Dictionaries_idDictionary, Code) values (2, 'if (x > y) std::swap(x, y);');

insert into Dictionary_Codes (Dictionaries_idDictionary, Code) values (2, 'bool isEven = (num % 2 == 0);');

insert into Dictionary_Codes (Dictionaries_idDictionary, Code) values (2, 'std::map<std::string, int> score;'); 

insert into Dictionary_Codes (Dictionaries_idDictionary, Code) values (2, 'const int MAX_SIZE = 100;');

