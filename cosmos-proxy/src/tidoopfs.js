/**
 * Copyright 2016 Telefonica Investigación y Desarrollo, S.A.U
 *
 * This file is part of frb-cosmos-proxy.
 *
 * frb-cosmos-proxy is free software: you can redistribute it and/or modify it under the terms of the GNU Affero
 * General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 * frb-cosmos-proy is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the
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
 * Author: pcoello25
 */

var fs = require('fs'),
    pathToFile = require('../conf/cosmos-proxy.json').cache_file,
    conf = require('../conf/cosmos-proxy.json');
    logger = require('./logger.js');

function isEmptyFile() {
    var contentFile = fs.readFileSync(pathToFile);
    return (contentFile.length == 0);
} // isEmptyFile

function fileExists() {
    var file = fs.readFileSync(pathToFile);

    if (file) {
        return true;
    } else {
        return false;
    } // if else
} // fileExists

function checkConfFile() {
    var validConfFile = true;

    if (conf.host === undefined) {
        logger.error('\'host\' is undefined.');
        validConfFile = false;
    } // if

    if (conf.port === undefined) {
        logger.error('\'port\' is undefined.');
        validConfFile = false;
    } // if

    if (conf.target !== undefined) {
        if (conf.target.host === undefined) {
            logger.error('\'target.host\' is undefined.');
            validConfFile = false;
        } // if

        if (conf.target.port === undefined) {
            logger.error('\'target.port\' is undefined.');
            validConfFile = false;
        } // if
    } else {
        logger.error('\'target\' is undefined.');
        validConfFile = false;
    } // if else

    if (conf.idm !== undefined) {
        if (conf.idm.host === undefined) {
            logger.error('\'idm.host\' is undefined.');
            validConfFile = false;
        } // if

        if (conf.idm.port === undefined) {
            logger.error('\'idm.port\' is undefined.');
            validConfFile = false;
        } // if
    } else {
        logger.error('\'idm\' is undefined.');
        validConfFile = false;
    } // if else

    if (conf.public_paths_list === undefined) {
        logger.error('\'public_path_list\' is undefined.');
        validConfFile = false;
    } // if

    if (conf.superuser === undefined) {
        logger.error('\'superuser\' is undefined.');
        validConfFile = false;
    } // if

    if (conf.log !== undefined) {
        if (conf.log.date_pattern === undefined) {
            logger.error('\'log.date_pattern\' is undefined.');
            validConfFile = false;
        } // if

        if (conf.log.file_name === undefined) {
            logger.error('\'log.file_name\' is undefined.');
            validConfFile = false;
        } // if
    } else {
        logger.error('\'log\' is undefined.');
        validConfFile = false;
    } // if else

    if (conf.cache_file === undefined) {
        logger.error('\'cache_file\' is undefined.');
        validConfFile = false;
    } // if

    if (!validConfFile) {
        logger.error('Please, check your configuration file and fix errors.');
    } // if

    return validConfFile;
} // checkConfFile

module.exports = {
    isEmptyFile: isEmptyFile,
    fileExists: fileExists,
    checkConfFile: checkConfFile,
} // module.exports
