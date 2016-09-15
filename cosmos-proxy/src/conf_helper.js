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

var conf = require('../conf/cosmos-proxy.json');

function checkConfFile() {
    var validConfFile = true;

    if ((conf.host === undefined) || (conf.host === null) || (conf.host.length === 0)) {
        validConfFile = false;
    } // if

    if ((conf.port === undefined) || (conf.port === null) || (conf.port.length === 0)) {
        validConfFile = false;
    } // if

    if ((conf.target !== undefined) || (conf.target !== "") || (conf.target !== null)) {

        if ((conf.target.host === undefined) || (conf.target.host === null) || (conf.target.host.length === 0)) {
            validConfFile = false;
        } // if

        if ((conf.target.port === undefined) || (conf.target.port === null) || (conf.target.port.length === 0)) {
            validConfFile = false;
        } // if

    } else {
        validConfFile = false;
    } // if else

    if ((conf.idm !== undefined) || (conf.idm !== "") || (conf.idm !== null)) {

        if ((conf.idm.host === undefined) || (conf.idm.host === null) || (conf.idm.host.length === 0)) {
            validConfFile = false;
        } // if

        if ((conf.idm.port === undefined) || (conf.idm.port === null) || (conf.idm.port.length == 0)) {
            validConfFile = false;
        } // if

    } else {
        validConfFile = false;
    } // if else

    if (conf.public_paths_list === undefined) {
        validConfFile = false;
    } // if

    if ((conf.superuser === undefined) || (conf.superuser === null) || (conf.superuser.length == 0)) {
        validConfFile = false;
    } // if

    if ((conf.log !== undefined) || (conf.log !== "") || (conf.log !== null)) {

        if ((conf.log.date_pattern === undefined) || (conf.log.date_pattern === null)
            || (conf.log.date_pattern.length === 0)) {
            validConfFile = false;
        } // if

        if ((conf.log.file_name === undefined) || (conf.log.file_name === null)
            || (conf.log.file_name.length === 0)) {
            validConfFile = false;
        } // if

    } else {
        validConfFile = false;
    } // if else

    if ((conf.cache_file === undefined) || (conf.cache_file === null) || (conf.cache_file.length === 0)) {
        validConfFile = false;
    } // if

    return validConfFile;
} // checkConfFile

module.exports = {
    checkConfFile: checkConfFile
} // module.exports