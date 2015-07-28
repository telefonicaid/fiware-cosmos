CREATE DATABASE IF NOT EXISTS cosmos;
USE cosmos;

CREATE TABLE cosmos_user (idm_username VARCHAR(128) NOT NULL PRIMARY KEY UNIQUE, username TEXT NOT NULL, password TEXT NOT NULL, hdfs_quota INTEGER NOT NULL, registration_time TIMESTAMP NOT NULL);
