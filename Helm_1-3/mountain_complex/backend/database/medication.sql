DROP TABLE IF EXISTS `medication`;
CREATE TABLE `medication` (
  `recordId` BIGINT NOT NULL AUTO_INCREMENT
  , `createdOn` DATETIME DEFAULT CURRENT_TIMESTAMP
  , `updatedOn` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
  , `isDeleted` CHAR(1) DEFAULT 'N'
  , `parentId` BIGINT NOT NULL

  /* Add more columns */
  , `name` VARCHAR(256)
  , `dosage` VARCHAR(256)
  , `prescriber` VARCHAR(512)
  , `pharmacy` VARCHAR(512)
  , `purpose` VARCHAR(512)

  , PRIMARY KEY (`recordId`)
  , FOREIGN KEY fk_parent(parentId) REFERENCES patient(recordId) ON UPDATE CASCADE ON DELETE CASCADE

  , INDEX idx_createdOn (`createdOn`)
  , INDEX idx_updatedOn (`updatedOn`)
  , INDEX idx_isDeleted (`isDeleted`)
  , INDEX idx_name (`name`)
);
