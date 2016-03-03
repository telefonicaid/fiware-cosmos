/**
 * Copyright 2016 Telefonica Investigación y Desarrollo, S.A.U
 *
 * This file is part of fiware-cosmos (FI-WARE project).
 *
 * fiware-cosmos is free software: you can redistribute it and/or modify it under the terms of the GNU Affero
 * General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 * fiware-cosmos is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the
 * implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with fiware-cosmos. If not, see
 * http://www.gnu.org/licenses/.
 *
 * For those usages not covered by the GNU Affero General Public License please contact with
 * francisco dot romerobueno at telefonica dot com
 */

/**
 * Command runner.
 *
 * Author: frb
 */

// Module dependencies
var spawn = require('child_process').spawn;
var mysqlDriver = require('./mysql_driver.js');

function runHadoopJar(jobId, jarPath, className, jarPath, inputData, outputData, callback) {
    var params = ['jar', jarPath, className, '-libjars', jarPath, inputData, outputData];
    var job = spawn('hadoop', params);
    var result = '';

    job.stdout.on('data', function (data) {
        result += 'stdout: ' + data.toString();
    });

    job.stderr.on('data', function (data) {
        result += 'stderr: ' + data.toString();
        var dataStr = data.toString();
        var indexOfMap = dataStr.indexOf('map ');
        var indexOfReduce = dataStr.indexOf('reduce ');
        var indexFirstPercentage = dataStr.indexOf('%');
        var indexSecondPercentage = dataStr.lastIndexOf('%');

        if(indexOfMap >= 0 && indexOfReduce >= 0 && indexFirstPercentage >= 0 && indexSecondPercentage >= 0) {
            var mapProgress = dataStr.substring(indexOfMap + 4, indexFirstPercentage);
            var reduceProgress = dataStr.substring(indexOfReduce + 7, indexSecondPercentage);
            mysqlDriver.updateJobStatus(jobId, mapProgress, reduceProgress, function (error, result) {
                if (error) {
                    callback(error);
                }
            });
        } // if
    });

    job.on('close', function (code) {
        return callback(null, result);
    });
} // runHadoopJar

function runKill(jobId, callback) {
    // TBD
} // runKill

module.exports = {
    runHadoopJar: runHadoopJar,
    runKill: runKill
} // module.exports
