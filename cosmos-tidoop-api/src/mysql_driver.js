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
var mysqlConfig = require('../conf/cosmos-tidoop-api.json').mysql;
var logger = require('./logger.js');

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

function addJob(jobId, className, callback) {
    var query = connection.query(
        'INSERT INTO tidoop_job (jobId, className, startTime, mapProgress, reduceProgress) ' +
        'VALUES (?, ?, NOW(), ?, ?)',
        [jobId, className, 0, 0],
        function (error, result) {
            if (error) {
                callback(error)
            } else {
                logger.info('Successful insert: \'INSERT INTO tidoop_job ' +
                    '(jobId, className, startTime, mapProgress, reduceProgress) VALUES' +
                    '(' + jobId + ', ' + className + ', NOW(), 0, 0)\'');
                callback(null, result);
            } // if else
        }
    );
} // addJob

function updateJobStatus(jobId, mapProgress, reduceProgress, callback) {
    if (mapProgress == 100 && reduceProgress == 100) {
        var query = connection.query(
            'UPDATE tidoop_job SET endTime=NOW(), mapProgress=?, reduceProgress=? WHERE jobId=\'' + jobId + '\'',
            [mapProgress, reduceProgress],
            function (error, result) {
                if (error) {
                    callback(error);
                } else {
                    logger.info('Successful update: \'UPDATE tidoop_job ' +
                        'SET endTime=NOW(), mapProgress=' + mapProgress + ', reduceProgress=' +
                        reduceProgress + ' WHERE jobId=\'' + jobId + '\'\'');
                    callback(null, result);
                } // if else
            }
        );
    } else {
        var query = connection.query(
            'UPDATE tidoop_job SET mapProgress=?, reduceProgress=? WHERE jobId=\'' + jobId + '\'',
            [mapProgress, reduceProgress],
            function (error, result) {
                if (error) {
                    callback(error);
                } else {
                    logger.info('Successful update: \'UPDATE tidoop_job ' +
                        'SET mapProgress=' + mapProgress + ', reduceProgress=' + reduceProgress +
                        ' WHERE jobId=\'' + jobId + '\'\'');
                    callback(null, result);
                } // if else
            }
        );
    } // if else
} // updateJobStatus

function getJob(jobId, callback) {
    var query = connection.query(
        'SELECT * from tidoop_job WHERE jobId=\'' + jobId + '\'',
        function (error, result) {
            if (error) {
                callback(error);
            } else {
                logger.info('Successful select: \'SELECT * from tidoop_job WHERE jobId=\'' + jobId + '\'\'');
                callback(null, result);
            } // if else
        }
    );
} // getJob

function close(callback) {
    connection.end(function(error) {
        if (error) {
            callback(error);
        } else {
            callback(null);
        } // if else
    });
} // close

module.exports = {
    connect: connect,
    addJob: addJob,
    updateJobStatus: updateJobStatus,
    getJob: getJob,
    close: close
} // module.exports
