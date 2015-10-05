USE cosmos;

ALTER TABLE cosmos_user MODIFY registration_time TIMESTAMP DEFAULT "0000-00-00 00:00:00";
ALTER TABLE cosmos_user ADD COLUMN last_access_time TIMESTAMP DEFAULT "0000-00-00 00:00:00";
ALTER TABLE cosmos_user ADD COLUMN hdfs_used BIGINT NOT NULL;
ALTER TABLE cosmos_user ADD COLUMN fs_used BIGINT NOT NULL;
ALTER TABLE cosmos_user MODIFY hdfs_quota BIGINT NOT NULL;
UPDATE cosmos_user SET hdfs_quota=1073741824*hdfs_quota;
