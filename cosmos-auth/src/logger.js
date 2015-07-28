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
var config = require('../conf/cosmos-gui.json');
var winston = require('winston');

// Global variables
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

module.exports = {
    info: info,
    error: error,
    warn: warn,
    debug: debug
} // module.exports
