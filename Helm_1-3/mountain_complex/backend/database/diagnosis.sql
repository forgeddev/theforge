DROP TABLE IF EXISTS `diagnosis`;
CREATE TABLE `diagnosis` (
  `recordId` BIGINT NOT NULL AUTO_INCREMENT
  , `createdOn` DATETIME DEFAULT CURRENT_TIMESTAMP
  , `updatedOn` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
  , `isDeleted` CHAR(1) DEFAULT 'N'
  , `parentId` BIGINT NOT NULL

  /* Add more columns */
  , `diagnosisConditionType` BIGINT
  , `diagnosisOutcomeType` BIGINT
  , `diagnosisDate` DATETIME
  , `treatmentPlan` VARCHAR(2000)
  , `medicalHistory` VARCHAR(2000)


  , PRIMARY KEY (`recordId`)
  , FOREIGN KEY fk_parent(parentId) REFERENCES patient(recordId) ON UPDATE CASCADE ON DELETE CASCADE
  , FOREIGN KEY fk_diagnosisConditionType(diagnosisConditionType) REFERENCES list(recordId) ON UPDATE CASCADE ON DELETE CASCADE
  , FOREIGN KEY fk_diagnosisOutcomeType(diagnosisOutcomeType) REFERENCES list(recordId) ON UPDATE CASCADE ON DELETE CASCADE

  , INDEX idx_createdOn (`createdOn`)
  , INDEX idx_updatedOn (`updatedOn`)
  , INDEX idx_isDeleted (`isDeleted`)
  , INDEX idx_diagnosisDate (`diagnosisDate`)

);
