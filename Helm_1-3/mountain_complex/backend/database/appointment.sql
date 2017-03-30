DROP TABLE IF EXISTS `appointment`;
CREATE TABLE `appointment` (
  `recordId` BIGINT NOT NULL AUTO_INCREMENT
  , `createdOn` DATETIME DEFAULT CURRENT_TIMESTAMP
  , `updatedOn` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
  , `isDeleted` CHAR(1) DEFAULT 'N'
  , `parentId` BIGINT NOT NULL

  /* Add more columns */
  , `summary` VARCHAR(256)
  , `notes` VARCHAR(2000)
  , `appointmentType` BIGINT
  , `when` DATETIME
  , `duration` INTEGER
  , `name` VARCHAR(256)
  , `primaryPhone` VARCHAR(256)
  , `alternatePhone` VARCHAR(256)
  , `email` VARCHAR(256)
  , `address` VARCHAR(256)
  , `city` VARCHAR(256)
  , `state` VARCHAR(256)
  , `zip` VARCHAR(256)

  , PRIMARY KEY (`recordId`)
  , FOREIGN KEY fk_parent(parentId) REFERENCES patient(recordId) ON UPDATE CASCADE ON DELETE CASCADE
  , FOREIGN KEY fk_appointmentType(appointmentType) REFERENCES list(recordId) ON UPDATE CASCADE ON DELETE CASCADE

  , INDEX idx_createdOn (`createdOn`)
  , INDEX idx_updatedOn (`updatedOn`)
  , INDEX idx_isDeleted (`isDeleted`)
  , INDEX idx_when (`when`)
  , INDEX idx_name (`name`)
  , INDEX idx_primaryPhone (`primaryPhone`)
  , INDEX idx_alternatePhone (`alternatePhone`)
  , INDEX idx_email (`email`)
  , INDEX idx_address (`address`)
  , INDEX idx_city (`city`)
  , INDEX idx_state (`state`)
  , INDEX idx_zip (`zip`)
);
