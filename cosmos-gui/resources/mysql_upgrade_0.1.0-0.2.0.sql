USE cosmos;

# 0.1.0 registration_time updates to current time always an update is performed, this line fixes it
ALTER TABLE cosmos_user MODIFY registration_time TIMESTAMP DEFAULT "0000-00-00 00:00:00";
ALTER TABLE cosmos_user ADD COLUMN last_access_time TIMESTAMP DEFAULT "0000-00-00 00:00:00";
ALTER TABLE cosmos_user ADD COLUMN hdfs_used BIGINT NOT NULL;
ALTER TABLE cosmos_user ADD COLUMN fs_used BIGINT NOT NULL;
ALTER TABLE cosmos_user ADD COLUMN num_ssh_conn_ok BIGINT NOT NULL;
ALTER TABLE cosmos_user ADD COLUMN num_ssh_conn_fail BIGINT NOT NULL;
ALTER TABLE cosmos_user MODIFY hdfs_quota BIGINT NOT NULL;
# 0.1.0 HDFS quota was measured in Gigabytes, now it is measured in bytes (1 GB = 1073741824 bytes)
UPDATE cosmos_user SET hdfs_quota=1073741824*hdfs_quota;
