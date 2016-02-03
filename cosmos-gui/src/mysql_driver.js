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

// Create a pool of connections to the database
var pool = mysql.createPool({
    host: mysqlConfig.host,
    port: mysqlConfig.port,
    user: mysqlConfig.user,
    password: mysqlConfig.password,
    database: mysqlConfig.database
});

function addUser(id, email, hdfsQuota, callback) {
    pool.getConnection(function(error, connection) {
        if (error) {
            if (callback) {
                callback(error);
            } // if
        } else {
            var query = connection.query(
                'INSERT INTO cosmos_user (id, email, hdfs_quota) ' +
                'VALUES (?, ?, ?)',
                [id, email, hdfsQuota],
                function (error, result) {
                    if (error) {
                        if (callback) {
                            callback(error);
                        } // if
                    } else {
                        logger.info('Successful insert: \'INSERT INTO cosmos_user ' +
                            '(id, email, hdfs_quota) VALUES ' +
                            '(' + id + ', ' + email + ', ' + hdfsQuota + ')\'');
                        connection.release();

                        if (callback) {
                            callback(null, result);
                        } // if
                    } // if else
                }
            );
        } // if else
    });
} // addUser

function getUser(id, callback) {
    pool.getConnection(function(error, connection) {
        if (error) {
            if (callback) {
                callback(error);
            } // if
        } else {
            var query = connection.query(
                'SELECT * from cosmos_user WHERE id=\'' + id + '\'',
                function (error, result) {
                    if (error) {
                        if (callback) {
                            callback(error);
                        } // if
                    } else {
                        logger.info('Successful select: \'SELECT * from cosmos_user WHERE id=\'' + id + '\'');
                        connection.release();

                        if (callback) {
                            callback(null, result);
                        } // if
                    } // if else
                }
            );
        } // if else
    });
} // getUser

module.exports = {
    addUser: addUser,
    getUser: getUser
} // module.exports
