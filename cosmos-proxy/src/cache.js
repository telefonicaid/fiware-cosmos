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
    cache = JSON.parse("[]"),
    pathToFile = require('../conf/cosmos-proxy.json').cache_file;

function createEmptyFileCache() {
    return fs.closeSync(fs.openSync(pathToFile, 'w'));
} // createEmptyCache

function isCacheEmpty() {
    return (cache == null || cache.length == undefined || cache.length == 0);
} // isCacheEmpty

function isCacheAuthenticated(reqUser, token) {
    if (!isCacheEmpty()) {
        for (var i = 0; i < cache.length; i++) {
            if (cache[i].user === reqUser) {
                if (cache[i].token === token) {
                    return 1;
                } else {
                    return 2;
                } // if else
            } // if
        } // for
        return 0;
    } else {
        return 0;
    } // if else
} // isCacheAuthenticated

function updateCacheFile() {
    fs.writeFileSync(pathToFile, JSON.stringify(cache), 'utf8');
} // updateFileCache

function loadCacheData() {
    cache = JSON.parse(fs.readFileSync(pathToFile, 'utf8'));
} // loadCacheData

function pushNewEntry(newValue) {
    cache.push(newValue);
    updateCacheFile(pathToFile);
} // pushNewEntry

function updateEntry(user, token) {
    for (var i = 0; i < cache.length; i++) {
        if (cache[i].user === user) {
            cache[i].token = token;
            updateCacheFile(pathToFile);
            break;
        } // if
    } // for
} // updateEntry

function toString() {
    return JSON.stringify(cache);
} // toString

module.exports = {
    isCacheAuthenticated: isCacheAuthenticated,
    createEmptyFileCache: createEmptyFileCache,
    loadCacheData: loadCacheData,
    isCacheEmpty: isCacheEmpty,
    pushNewEntry: pushNewEntry,
    updateEntry: updateEntry,
    toString: toString
} // module.exports

