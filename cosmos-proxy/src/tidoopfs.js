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
    pathToFile = require('../conf/cosmos-proxy.json').cache_file;

function isEmptyFile() {
    var contentFile = fs.readFileSync(pathToFile);
    return (contentFile.length == 0);
} // isEmptyFile

function fileExists() {
    try {
        fs.accessSync(pathToFile);
        return true;
    } catch (e) {
        return false;
    } // try catch
} // fileExists

module.exports = {
    isEmptyFile: isEmptyFile,
    fileExists: fileExists
} // module.exports
