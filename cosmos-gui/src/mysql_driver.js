/**
 * Copyright 2015 Telefonica Investigación y Desarrollo, S.A.U
 *
 * This file is part of fiware-tidoop (FI-WARE project).
 *
 * fiware-tidoop is free software: you can redistribute it and/or modify it under the terms of the GNU Affero
 * General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 * fiware-tidoop is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the
 * implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with fiware-tidoop. If not, see
 * http://www.gnu.org/licenses/.
 *
 * For those usages not covered by the GNU Affero General Public License please contact with
 * francisco dot romerobueno at telefonica dot com
 */

/**
 * MySQL driver.
 *
 * Author: frb
 */

// Module dependencies
var mysql = require('mysql');
var mysqlConfig = require('../conf/cosmos-gui.json').mysql;
var logger = require('./logger.js');

// Create a connection to the database
var connection = mysql.createConnection({
    host: mysqlConfig.host,
    port: mysqlConfig.port,
    user: mysqlConfig.user,
    password: mysqlConfig.password,
    database: mysqlConfig.database
});

function connect(callback) {
    connection.connect(function (error) {
        if (error) {
            callback(error);
        } else {
            logger.info('Connected to http://' + mysqlConfig.host + ':' + mysqlConfig.port + '/' +
                mysqlConfig.database);
            callback(null);
        } // if else
    });
} // connect

function addUser(idm_username, username, password, callback) {
    var query = connection.query(
        'INSERT INTO cosmos_user (idm_username, username, password) ' +
        'VALUES (?, ?, ?)',
        [idm_username, username, password],
        function (error, result) {
            if (error) {
                callback(error)
            } else {
                logger.info('Successful insert: \'INSERT INTO cosmos_user ' +
                    '(idm_username, username, password) VALUES' +
                    '(' + idm_username + ', ' + username + ', ' + password + ')\'');
                callback(null, result);
            } // if else
        }
    );
} // addUser

function addPassword(idm_username, password, callback) {
    var query = connection.query(
        'UPDATE cosmos_user SET password=\'' + password + '\' WHERE idm_username=\'' + idm_username + '\'',
        function(error, result) {
            if (error) {
                callback(error);
            } else {
                logger.info('Successful update: \'UPDATE cosmos_user SET password=\'' + password +
                    '\' WHERE idm_username=\'' + idm_username + '\'');
                callback(null, result);
            } // if else
        }
    );
} // addPassword

function getUser(idm_username, callback) {
    var query = connection.query(
        'SELECT * from cosmos_user WHERE idm_username=\'' + idm_username + '\'',
        function (error, result) {
            if (error) {
                callback(error);
            } else {
                logger.info('Successful select: \'SELECT * from cosmos_user WHERE idm_username=\'' +
                    idm_username + '\'');
                callback(null, result);
            } // if else
        }
    );
} // getUser

function close(connection) {
    connection.end();
} // close

module.exports = {
    connect: connect,
    addUser: addUser,
    addPassword: addPassword,
    getUser: getUser,
    close: close
} // module.exports
