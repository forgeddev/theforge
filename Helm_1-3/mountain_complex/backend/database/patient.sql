DROP TABLE IF EXISTS `patient`;
CREATE TABLE `patient` (
  `recordId` BIGINT NOT NULL AUTO_INCREMENT
  , `createdOn` DATETIME DEFAULT CURRENT_TIMESTAMP
  , `updatedOn` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
  , `isDeleted` CHAR(1) DEFAULT 'N'

  /* Add more columns */
  , `firstName` VARCHAR(256)
  , `lastName` VARCHAR(256)
  , `middleName` VARCHAR(256)
  , `dateOfBirth` DATETIME

  , `internalId` VARCHAR(256)
  , `alternateId` VARCHAR(256)

  , `primaryPhone` VARCHAR(256)
  , `alternatePhone` VARCHAR(256)

  , `email` VARCHAR(256)

  , `address` VARCHAR(256)
  , `city` VARCHAR(256)
  , `state` VARCHAR(256)
  , `zip` VARCHAR(256)
  , `county` VARCHAR(256)
  , `township` VARCHAR(256)


  , PRIMARY KEY (`recordId`)
  , INDEX idxCreatedOn (`createdOn`)
  , INDEX idxUpdatedOn (`updatedOn`)
  , INDEX idxIsDeleted (`isDeleted`)

  , INDEX idx_firstName (`firstName`)
  , INDEX idx_lastName (`lastName`)
  , INDEX idx_dateOfBirth (`dateOfBirth`)
  , INDEX idx_internalId (`internalId`)
  , INDEX idx_alternateId (`alternateId`)
  , INDEX idx_primaryPhone (`primaryPhone`)
  , INDEX idx_alternatePhone (`alternatePhone`)
  , INDEX idx_email (`email`)
  , INDEX idx_address (`address`)
  , INDEX idx_city (`city`)
  , INDEX idx_state (`state`)
  , INDEX idx_zip (`zip`)
  , INDEX idx_county (`county`)
  , INDEX idx_township (`township`)
);
