DROP TABLE IF EXISTS user;
CREATE TABLE user (
  `recordId` BIGINT NOT NULL AUTO_INCREMENT
  , `createdOn` DATETIME DEFAULT CURRENT_TIMESTAMP
  , `updatedOn` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
  , `isDeleted` CHAR(1) DEFAULT 'N'

  /* Add more columns */
  , `email` VARCHAR(256)
  , `password` VARCHAR(512)
  , `admin` CHAR(1) DEFAULT 'N'
  , `locked` CHAR(1) DEFAULT 'N'
  , `failed_attempts` INT DEFAULT 0

  , PRIMARY KEY (recordId)
  , INDEX idxCreatedOn (createdOn)
  , INDEX idxUpdatedOn (updatedOn)
  , INDEX idxIsDeleted (isDeleted)
);
