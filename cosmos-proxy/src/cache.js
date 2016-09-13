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
    cache = [],
    pathToFile = require('../conf/cosmos-proxy.json').cache_file;

function createEmptyFileCache() {
    return fs.closeSync(fs.openSync(pathToFile, 'w'));
} // createEmptyCache

function isCacheEmpty() {
    return (cache == null || cache.length == undefined || cache.length == 0);
} // isCacheEmpty

function isUsersToken(reqUser, token) {
    if (!isCacheEmpty()) {
        for (var i = 0; i < cache.length; i++) {
            if ((cache[i]['user'] === reqUser) && (cache[i]['token'] === token)) {
                return true;
            } // if
        } // for
    } // if

    return false;
} // isInCache

function isCacheAuthenticated(reqUser, token) {
    if (isUsersToken(reqUser, token)) {
        return true;
    } // if

    return false;
} // isCacheAuthenticated

function updateCacheFile() {
    fs.writeFileSync(pathToFile,'[' + cache + ']');
} // updateFileCache

function loadCacheData() {
    cache = JSON.parse(fs.readFileSync(pathToFile, 'utf8'));
} // loadCacheData

function pushNewEntry(newValue) {
    cache.push(newValue);
    updateCacheFile(pathToFile);
} // pushNewEntry

module.exports = {
    isCacheAuthenticated: isCacheAuthenticated,
    updateCacheFile: updateCacheFile,
    createEmptyFileCache: createEmptyFileCache,
    loadCacheData: loadCacheData,
    isCacheEmpty: isCacheEmpty,
    pushNewEntry: pushNewEntry
} // module.exports

