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
 * mysql_driver tests
 *
 * Author: frb
 */

// Module dependencies
var assert = require('assert');
var rewire = require('rewire');
var mysqlDriver = rewire('../../src/mysql_driver.js');

// Testing variables
var id = 'frb';
var email = 'frb@tid.es';
var hdfsQuota = 5;

// Mock the mysql connection
var connectionMock = {
    connect: function(callback) {
        return callback(null);
    },
    query: function(query, values, callback) {
        query = query || '';
        values = values || [];
        callback = callback || function(error, result) {};

        if (query.indexOf('INSERT INTO cosmos_user (id, email, hdfs_quota)') > -1) {
            return callback(null, []);
        } else if (query.indexOf('SELECT * from cosmos_user WHERE id') > -1) {
            return callback(null, [id]);
        } else {
            return callback('error', null);
        } // if else if
    },
    end: function() {}
};
mysqlDriver.__set__('connection', connectionMock);

// Tests suite
describe('[mysqlDriver.addUser] add a new user', function() {
    it('should return null error and an empty result set', function() {
        mysqlDriver.addUser(id, email, hdfsQuota, function(error, result) {
            assert.equal(null, error);
            assert.equal(0, result.length);
        });
    });
});

describe('[mysqlDriver.getUser] get a user by his/her id', function() {
    it('should return null error and a result set containing ' + id, function() {
        mysqlDriver.getUser(id, function(error, result) {
            assert.equal(null, error);
            assert.equal(username, result[0]);
        });
    });
});
