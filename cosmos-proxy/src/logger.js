/**
 * Copyright 2016 Telefonica Investigación y Desarrollo, S.A.U
 *
 * This file is part of frb-cosmos-proxy.
 *
 * frb-cosmos-proxy is free software: you can redistribute it and/or modify it under the terms of the GNU Affero
 * General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 * frb-cosmos-proxy is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the
 * implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with frb-cosmos-proxy. If not, see
 * http://www.gnu.org/licenses/.
 *
 * For those usages not covered by the GNU Affero General Public License please contact with
 * francisco dot romerobueno at telefonica dot com
 */

/**
 *
 * Author: frbattid
 */

// Module dependencies
var config = require('../conf/cosmos-proxy.json');
    winston = require('winston');

// Global variables
try {
    var logFileName = config.log.file_name;
    var logDatePattern = config.log.data_pattern;

    // Winston configuration
    winston.add(winston.transports.DailyRotateFile, {
        filename: logFileName,
        datePattern: logDatePattern
    });

    function info(message) {
        winston.info(message);
    } // info

    function error(message) {
        winston.error(message);
    } // error

    function warn(message) {
        winston.warn(message);
    } // warn

    function debug(message) {
        winston.debug(message);
    } // debug
} catch (e) {
    // Reached only if any log parameter is missing. Logs shown in the general method 'tidoopfs.checkConfFile'
} // try catch

module.exports = {
    info: info,
    error: error,
    warn: warn,
    debug: debug
} // module.exports
