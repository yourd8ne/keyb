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
  `NumberOfCodes` iNT NOT NULL,
  PRIMARY KEY (`idDictionary`)
) ENGINE=MyISAM;

-- -----------------------------------------------------
-- Table `KeyB`.`Languages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `KeyB`.`Languages` (
  `idLanguage` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(255),
  `HighlightName` VARCHAR(255),
  PRIMARY KEY (`idLanguage`)
) ENGINE=MyISAM;

-- -----------------------------------------------------
-- Table `KeyB`.`Dictionary_Codes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `KeyB`.`Dictionary_Codes` (
  `Dictionaries_idDictionary` INT NOT NULL,
  `idCode` INT NOT NULL AUTO_INCREMENT,
  `Code` TEXT,
  PRIMARY KEY (`Dictionaries_idDictionary`, `idCode`)
) ENGINE=MyISAM;

-- -----------------------------------------------------
-- Table `KeyB`.`attempt`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `KeyB`.`Attempts` (
  `idAttempt` INT NOT NULL AUTO_INCREMENT,
  `Date` TIMESTAMP NOT NULL,
  `Time` TIME NOT NULL,
  `idUser` INT NOT NULL,
  `idDictionary` INT NOT NULL,
  `inClass` TINYINT NOT NULL,
  `Speed` DOUBLE NOT NULL,
  `NumberOfCharacters` INT NOT NULL,
  PRIMARY KEY (`idAttempt`),
  INDEX `id_user_idx` (`idUser` ASC),
  INDEX `id_dictionary_idx` (`idDictionary` ASC),
  CONSTRAINT `id_user_fk`
    FOREIGN KEY (`idUser`)
    REFERENCES `KeyB`.`Users` (`idUsers`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `id_dictionary_fk`
    FOREIGN KEY (`idDictionary`)
    REFERENCES `KeyB`.`Dictionaries` (`idDictionary`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=MyISAM;

CREATE TABLE IF NOT EXISTS `KeyB`.`Attempts_Codes` (
  `idAttempts` INT NOT NULL,
  `idDictionary` INT NOT NULL,
  `idCode` INT NOT NULL,
  PRIMARY KEY (`idAttempts`, `idCode`),
  CONSTRAINT `fk_attempts`
    FOREIGN KEY (`idAttempts`)
    REFERENCES `Attempts` (`idAttempt`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_dictionary`
    FOREIGN KEY (`idDictionary`)
    REFERENCES `Dictionaries` (`idDictionary`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_code`
    FOREIGN KEY `idCode`
    REFERENCES `KeyB`.`Dictionary_Codes` (`idCode`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=MyISAM;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;