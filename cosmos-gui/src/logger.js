/**
 * Copyright 2016 Telefonica Investigación y Desarrollo, S.A.U
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

// Logging levels
LoggingLevel = {
    OFF: 1,
    ERROR: 2,
    WARN: 3,
    INFO: 4,
    DEBUG: 5,
    ALL: 6
};

// Module dependencies
var config = require('../conf/cosmos-gui.json');
var winston = require('winston');

// Global variables
var logFileName = config.log.file_name;
var logDatePattern = config.log.data_pattern;
var logLevel = toLoggingLevel(config.log.level);

// Winston configuration
winston.add(winston.transports.DailyRotateFile, {
    filename: logFileName,
    datePattern: logDatePattern
});

function toLoggingLevel(level) {
    if (level === 'OFF') {
        return LoggingLevel.OFF;
    } else if (level === 'ERROR') {
        return LoggingLevel.ERROR;
    } else if (level === 'WARN') {
        return LoggingLevel.WARN;
    } else if (level === 'INFO') {
        return LoggingLevel.INFO;
    } else if (level === 'DEBUG') {
        return LoggingLevel.DEBUG;
    } else if (level === 'ALL') {
        return LoggingLevel.ALL;
    } else {
        return LoggingLevel.OFF;
    } // if else
} // toLoggingLevel

function error(message) {
    if (logLevel >= LoggingLevel.ERROR) {
        winston.error(message);
    } // if
} // error

function warn(message) {
    if (logLevel >= LoggingLevel.WARN) {
        winston.warn(message);
    } // if
} // warn

function info(message) {
    if (logLevel >= LoggingLevel.INFO) {
        winston.info(message);
    } // if
} // info

function debug(message) {
    if (logLevel >= LoggingLevel.DEBUG) {
        winston.debug(message);
    } // if
} // debug

module.exports = {
    error: error,
    warn: warn,
    info: info,
    debug: debug
} // module.exports
