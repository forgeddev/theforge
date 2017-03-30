DROP TABLE IF EXISTS list;
CREATE TABLE list (
  `recordId` BIGINT NOT NULL AUTO_INCREMENT
  , `createdOn` DATETIME DEFAULT CURRENT_TIMESTAMP
  , `updatedOn` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
  , `isDeleted` CHAR(1) DEFAULT 'N'

  /* Add more columns */
  , `category` VARCHAR(256)
  , `group` VARCHAR(256)
  , `group_required` CHAR(1) DEFAULT 'N'
  , `name` VARCHAR(256)
  , `order` INT DEFAULT NULL
  , `default` CHAR(1) DEFAULT 'N'

  , PRIMARY KEY (recordId)
  , INDEX idxCreatedOn (`createdOn`)
  , INDEX idxUpdatedOn (`updatedOn`)
  , INDEX idxIsDeleted (`isDeleted`)
  , INDEX idx_category (`category`)
  , INDEX idx_group (`group`)
  , INDEX idx_group_required (`group_required`)
  , INDEX idx_name (`name`)
  , INDEX idx_order (`order`)
  , INDEX idx_default (`default`)
);
