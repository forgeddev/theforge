DROP TABLE IF EXISTS `emergencyContact`;
CREATE TABLE `emergencyContact` (
  `recordId` BIGINT NOT NULL AUTO_INCREMENT
  , `createdOn` DATETIME DEFAULT CURRENT_TIMESTAMP
  , `updatedOn` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
  , `isDeleted` CHAR(1) DEFAULT 'N'
  , `parentId` BIGINT NOT NULL

  /* Add more columns */
  , `name` VARCHAR(256)
  , `primaryPhone` VARCHAR(256)
  , `alternatePhone` VARCHAR(256)
  , `email` VARCHAR(256)
  , `relationshipType` BIGINT

  , PRIMARY KEY (`recordId`)
  , FOREIGN KEY fk_parent(parentId) REFERENCES patient(recordId) ON UPDATE CASCADE ON DELETE CASCADE
  , FOREIGN KEY fk_relationshipType(relationshipType) REFERENCES list(recordId) ON UPDATE CASCADE ON DELETE CASCADE

  , INDEX idx_createdOn (`createdOn`)
  , INDEX idx_updatedOn (`updatedOn`)
  , INDEX idx_isDeleted (`isDeleted`)
  , INDEX idx_name (`name`)
  , INDEX idx_primaryPhone (`primaryPhone`)
  , INDEX idx_alternatePhone (`alternatePhone`)
  , INDEX idx_email (`email`)
);
