-- without Texts and attempt.result, attempt.idText
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema KeyB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `KeyB` DEFAULT CHARACTER SET utf8;
USE `KeyB`;

-- -----------------------------------------------------
-- Table `KeyB`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `KeyB`.`Users` (
  `idUsers` INT NOT NULL AUTO_INCREMENT,
  `Login` VARCHAR(255) NOT NULL,
  `Password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idUsers`),
  UNIQUE INDEX `id_UNIQUE` (`idUsers` ASC),
  UNIQUE INDEX `login_UNIQUE` (`Login` ASC)
) ENGINE=MyISAM;

-- -----------------------------------------------------
-- Table `KeyB`.`Dictionaries`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `KeyB`.`Dictionaries` (
  `idDictionary` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(255) NULL,
  `Languages_idLanguage` INT NOT NULL,
  PRIMARY KEY (`idDictionary`)
) ENGINE=MyISAM;

-- -----------------------------------------------------
-- Table `KeyB`.`Languages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `KeyB`.`Languages` (
  `idLanguage` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(255),
  `HighliteName` VARCHAR(255),
  PRIMARY KEY (`idLanguage`)
) ENGINE=MyISAM;

-- -----------------------------------------------------
-- Table `KeyB`.`Dictionary_Codes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `KeyB`.`Dictionary_Codes` (
  `Dictionaries_idDictionary` INT NOT NULL,
  `idCode` INT NOT NULL AUTO_INCREMENT,
  `Code` TEXT,
  PRIMARY KEY (`idCode`)
) ENGINE=MyISAM;

-- -----------------------------------------------------
-- Table `KeyB`.`attempt`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `KeyB`.`Attempt` (
  `idAttempt` INT NOT NULL AUTO_INCREMENT,
  `Date` TIMESTAMP NOT NULL,
  `Time` TIME NOT NULL,
  `idUser` INT NOT NULL,
  `idDict` INT NOT NULL,
  `inClass` TINYINT NOT NULL,
  `Speed` DOUBLE NOT NULL,
  PRIMARY KEY (`idAttempt`),
  INDEX `id_user_idx` (`idUser` ASC),
  INDEX `id_dictionary_idx` (`idDict` ASC),
  CONSTRAINT `id_user_fk`
    FOREIGN KEY (`idUser`)
    REFERENCES `KeyB`.`Users` (`idUsers`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `id_dictionary_fk`
    FOREIGN KEY (`idDict`)
    REFERENCES `KeyB`.`Dictionaries` (`idDictionary`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=MyISAM;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema KeyB without texts
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `KeyB` DEFAULT CHARACTER SET utf8;
USE `KeyB`;

-- -----------------------------------------------------
-- Table `KeyB`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `KeyB`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `login` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  UNIQUE INDEX `login_UNIQUE` (`login` ASC))
ENGINE = MariaDB;

-- -----------------------------------------------------
-- Table `KeyB`.`dictionary`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `KeyB`.`dictionary` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `text` TEXT NULL,
  PRIMARY KEY (`id`))
ENGINE = MariaDB;

-- -----------------------------------------------------
-- Table `KeyB`.`texts`
-- -- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `KeyB`.`texts` (
--   `id` INT NOT NULL AUTO_INCREMENT,
--   `idUser` INT NOT NULL,
--   `text` TEXT NOT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE INDEX `id_UNIQUE` (`id` ASC),
--   INDEX `idUser_idx` (`idUser` ASC),
--   CONSTRAINT `idUser_fk`
--     FOREIGN KEY (`idUser`)
--     REFERENCES `KeyB`.`users` (`id`)
--     ON DELETE NO ACTION
--     ON UPDATE NO ACTION)
-- ENGINE = MariaDB;

-- -----------------------------------------------------
-- Table `KeyB`.`attempt`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `KeyB`.`attempt` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `date` TIMESTAMP NOT NULL,
  `time` TIME NOT NULL,
  `idUser` INT NOT NULL,
  `idDict` INT NOT NULL,
  -- `idText` INT NOT NULL,
  -- `result` TINYINT NOT NULL,
  `inClass` TINYINT NOT NULL,
  `speed` DOUBLE NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `id_user_idx` (`idUser` ASC),
  INDEX `id_dictionary_idx` (`idDict` ASC),
  -- INDEX `id_text_idx` (`idText` ASC),
  CONSTRAINT `id_user_fk`
    FOREIGN KEY (`idUser`)
    REFERENCES `KeyB`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `id_dictionary_fk`
    FOREIGN KEY (`idDict`)
    REFERENCES `KeyB`.`dictionary` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  -- CONSTRAINT `id_text_fk`
  --   FOREIGN KEY (`idText`)
  --   REFERENCES `KeyB`.`texts` (`id`)
  --   ON DELETE NO ACTION
  --   ON UPDATE NO ACTION)
ENGINE = MariaDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- dict
-- INSERT INTO Dictionary (name, text) VALUES ('python', 'a = 0.1 + 0.3 \n b = 0.3 \n print(a == b)');
-- INSERT INTO Dictionary (name, text) VALUES ('cpp', 'double a = 0.1 + 0.2; \n double b = 0.3; \n std::cout << (bool)(a == b) << std::endl;');
-- INSERT INTO Dictionary (name, text) VALUES ('java', 'BigDecimal a = new BigDecimal("0.1").add(new BigDecimal("0.3")); \n BigDecimal b = new BigDecimal("0.3"); \n System.out.println(a.equals(b));');