DROP DATABASE cosmos_gui;
CREATE DATABASE cosmos_gui;
USE cosmos_gui;

CREATE TABLE cosmos_user (idm_username VARCHAR(128) NOT NULL PRIMARY KEY UNIQUE, username TEXT NOT NULL, password TEXT NOT NULL, registration_time TIMESTAMP NOT NULL);