SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema KeyB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `KeyB` DEFAULT CHARACTER SET utf8;
USE `KeyB`;

-- -----------------------------------------------------
-- Table `KeyB`.`Users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `KeyB`.`Users` (
  `idUsers` INT NOT NULL AUTO_INCREMENT,
  `Login` VARCHAR(255) NOT NULL,
  `Password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idUsers`),
  UNIQUE INDEX `id_UNIQUE` (`idUsers` ASC),
  UNIQUE INDEX `login_UNIQUE` (`Login` ASC)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `KeyB`.`Dictionaries`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `KeyB`.`Dictionaries` (
  `idDictionary` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(255) NOT NULL,
  `Languages_idLanguage` INT NOT NULL,
  `NumberOfCodesForStudent` INT NOT NULL,
  PRIMARY KEY (`idDictionary`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `KeyB`.`Languages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `KeyB`.`Languages` (
  `idLanguage` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(255),
  `HighlightName` VARCHAR(255),
  PRIMARY KEY (`idLanguage`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `KeyB`.`Dictionary_Codes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `KeyB`.`Dictionary_Codes` (
  `idCode` INT NOT NULL AUTO_INCREMENT,
  `Dictionaries_idDictionary` INT NOT NULL,
  `Code` TEXT,
  PRIMARY KEY (`idCode`),
  FOREIGN KEY (`Dictionaries_idDictionary`)
    REFERENCES `KeyB`.`Dictionaries` (`idDictionary`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `KeyB`.`Attempts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `KeyB`.`Attempts` (
  `idAttempt` INT NOT NULL AUTO_INCREMENT,
  `Date` TIMESTAMP NOT NULL,
  `Time` TIME NOT NULL,
  `idUser` INT NOT NULL,
  `idDictionary` INT NOT NULL,
  `inClass` TINYINT NOT NULL,
  `Speed` DOUBLE NOT NULL,
  `UserNumberOfCharacters` INT NOT NULL,
  `UserNumberOfSnippets` INT NOT NULL,
  `DirtinessIndex` DOUBLE NOT NULL,
  `BackspaceCount` INT NOT NULL,
  PRIMARY KEY (`idAttempt`),
  FOREIGN KEY (`idUser`)
    REFERENCES `KeyB`.`Users` (`idUsers`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`idDictionary`)
    REFERENCES `KeyB`.`Dictionaries` (`idDictionary`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `KeyB`.`Attempts_Codes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `KeyB`.`Attempts_Codes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `idAttempts` INT NOT NULL,
  `idDictionary` INT NOT NULL,
  `idCode` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_attempts_code` (`idAttempts`, `idCode`),
  FOREIGN KEY (`idAttempts`)
    REFERENCES `KeyB`.`Attempts` (`idAttempt`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`idDictionary`)
    REFERENCES `KeyB`.`Dictionaries` (`idDictionary`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`idCode`)
    REFERENCES `KeyB`.`Dictionary_Codes` (`idCode`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `KeyB`.`GlobalSettings` тоже больше не надо
-- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `KeyB`.`GlobalSettings` (
--   `id` INT NOT NULL AUTO_INCREMENT,
--   `SettingName` VARCHAR(255) NOT NULL,
--   `Value` INT NOT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE INDEX `setting_name_UNIQUE` (`SettingName` ASC)
-- ) ENGINE=InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;