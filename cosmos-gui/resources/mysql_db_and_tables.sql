CREATE DATABASE IF NOT EXISTS cosmos;
USE cosmos;

CREATE TABLE cosmos_user (idm_username VARCHAR(128) NOT NULL PRIMARY KEY UNIQUE, username TEXT NOT NULL, password TEXT NOT NULL, hdfs_quota BIGINT NOT NULL, hdfs_used BIGINT NOT NULL, fs_used BIGINT NOT NULL, registration_time TIMESTAMP DEFAULT "0000-00-00 00:00:00", last_access_time TIMESTAMP DEFAULT "0000-00-00 00:00:00", num_ssh_conn_ok BIGINT NOT NULL, num_ssh_conn_fail BIGINT NOT NULL);
