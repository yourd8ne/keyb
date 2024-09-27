DELIMITER //

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
    INSERT INTO approach (date, time, idUser, idDict, inClass, speed)
    VALUES (attemptTime, timeSpent, userId, dictId, 1, speed);
END //

DELIMITER ;