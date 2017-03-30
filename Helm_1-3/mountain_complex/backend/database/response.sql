DROP TABLE IF EXISTS `response`;
CREATE TABLE `response` (
  `recordId` BIGINT NOT NULL AUTO_INCREMENT
  , `createdOn` DATETIME DEFAULT CURRENT_TIMESTAMP
  , `updatedOn` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
  , `isDeleted` CHAR(1) DEFAULT 'N'
  , `parentId` BIGINT NOT NULL

  /* Add more columns */
  , `who` VARCHAR(256)
  , `summary` VARCHAR(256)
  , `notes` VARCHAR(2000)
  , `responseType` BIGINT
  , `when` DATETIME

  , PRIMARY KEY (`recordId`)
  , FOREIGN KEY fk_parent(parentId) REFERENCES resourceReferral(recordId) ON UPDATE CASCADE ON DELETE CASCADE
  , FOREIGN KEY fk_responseType(responseType) REFERENCES list(recordId) ON UPDATE CASCADE ON DELETE CASCADE

  , INDEX idx_createdOn (`createdOn`)
  , INDEX idx_updatedOn (`updatedOn`)
  , INDEX idx_isDeleted (`isDeleted`)
  , INDEX idx_when (`when`)
);
