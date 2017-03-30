DROP TABLE IF EXISTS `bodyComposition`;
CREATE TABLE `bodyComposition` (
  `recordId` BIGINT NOT NULL AUTO_INCREMENT
  , `createdOn` DATETIME DEFAULT CURRENT_TIMESTAMP
  , `updatedOn` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
  , `isDeleted` CHAR(1) DEFAULT 'N'
  , `parentId` BIGINT NOT NULL

  /* Add more columns */
  , `summary` VARCHAR(256)
  , `notes` VARCHAR(2000)
  , `when` DATETIME
  , `height` FLOAT(5,2)
  , `weight` FLOAT(5,2)
  , `bmi` FLOAT(5,2)
  , `bodyFat` FLOAT(5,2)

  , PRIMARY KEY (`recordId`)
  , FOREIGN KEY fk_parent(parentId) REFERENCES patient(recordId) ON UPDATE CASCADE ON DELETE CASCADE

  , INDEX idx_createdOn (`createdOn`)
  , INDEX idx_updatedOn (`updatedOn`)
  , INDEX idx_isDeleted (`isDeleted`)
  , INDEX idx_when (`when`)

);
