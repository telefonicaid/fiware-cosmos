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

// module dependencies
var mysql = require('mysql');
var host = require('../conf/tidoop-mr-lib-api.json').mysql.host;
var port = require('../conf/tidoop-mr-lib-api.json').mysql.port;
var user = require('../conf/tidoop-mr-lib-api.json').mysql.user;
var password = require('../conf/tidoop-mr-lib-api.json').mysql.password;
var database = require('../conf/tidoop-mr-lib-api.json').mysql.database;

var connection = mysql.createConnection({
    host: host,
    port: port,
    user: user,
    password: password,
    database: database
});

module.exports = {
    connect: function() {
        connection.connect(function (error) {
            if (error) {
                throw error;
            } else {
                console.log('Connected to http://' + host + ':' + port + '/' + database);
                return connection;
            } // if else
        });
    }, // connect

    addUser: function (jobId, jobType, callback) {
        var query = connection.query(
            'INSERT INTO tidoop_job (jobId, jobType, startTime, mapProgress, reduceProgress) ' +
            'VALUES (?, ?, NOW(), ?, ?)',
            [jobId, jobType, 0, 0],
            function (error, result) {
                if (error) {
                    callback(error)
                } else {
                    console.log('Successful insert: \'INSERT INTO tidoop_job ' +
                        '(jobId, jobType, startTime, mapProgress, reduceProgress) VALUES' +
                        '(' + jobId + ', ' + jobType + ', NOW(), 0, 0)\'');
                    callback(null, result);
                } // if else
            }
        );
    }, // addJob

    getUser: function (idm_username, callback) {
        var query = connection.query(
            'SELECT * from tidoop_job WHERE jobId=\'' + jobId + '\'',
            function (error, result) {
                if (error) {
                    callback(error);
                } else {
                    console.log('Successful select: \'SELECT * from tidoop_job WHERE jobId=\'' + jobId + '\'\'');
                    callback(null, result);
                } // if else
            }
        );
    }, // getJobStatus

    close: function(connection) {
        connection.end();
    } // end
}
