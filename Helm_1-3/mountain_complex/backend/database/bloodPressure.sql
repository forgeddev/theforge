DROP TABLE IF EXISTS `bloodPressure`;
CREATE TABLE `bloodPressure` (
  `recordId` BIGINT NOT NULL AUTO_INCREMENT
  , `createdOn` DATETIME DEFAULT CURRENT_TIMESTAMP
  , `updatedOn` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
  , `isDeleted` CHAR(1) DEFAULT 'N'
  , `parentId` BIGINT NOT NULL

  /* Add more columns */
  , `summary` VARCHAR(256)
  , `notes` VARCHAR(2000)
  , `when` DATETIME
  , `systolic` INTEGER
  , `diastolic` INTEGER
  , `heartRate` INTEGER

  , PRIMARY KEY (`recordId`)
  , FOREIGN KEY fk_parent(parentId) REFERENCES patient(recordId) ON UPDATE CASCADE ON DELETE CASCADE

  , INDEX idx_createdOn (`createdOn`)
  , INDEX idx_updatedOn (`updatedOn`)
  , INDEX idx_isDeleted (`isDeleted`)
  , INDEX idx_when (`when`)
  , INDEX idx_systolic (`systolic`)
  , INDEX idx_diastolic (`diastolic`)
  , INDEX idx_heartRate (`heartRate`)
);
