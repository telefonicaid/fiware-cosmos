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
var idm_username = 'frb@tid.es';
var username = 'frb1';
var password = '12345';
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

        if (query.indexOf('INSERT INTO cosmos_user (idm_username, username, password, hdfs_quota)') > -1) {
            return callback(null, []);
        } else if (query.indexOf('UPDATE cosmos_user SET password') > -1) {
            return callback(null, []);
        } else if (query.indexOf('SELECT * from cosmos_user WHERE idm_username') > -1) {
            return callback(null, [username]);
        } else if (query.indexOf('SELECT * from cosmos_user WHERE username') > -1) {
            return callback(null, [username]);
        } else {
            return callback('error', null);
        } // if else if
    },
    end: function() {}
};
mysqlDriver.__set__('connection', connectionMock);

// Tests suite
describe('[mysqlDriver.connect] create a MySQL connection', function() {
    it('should return null error', function () {
        mysqlDriver.connect(function(error) {
            assert.equal(null, error);
        });
    });
});

describe('[mysqlDriver.addUser] add a new user', function() {
    it('should return null error and an empty result set', function() {
        mysqlDriver.addUser(idm_username, username, password, hdfsQuota, function(error, result) {
            assert.equal(null, error);
            assert.equal(0, result.length);
        });
    });
});

describe('[mysqlDriver.addPassword] add a new password', function() {
    it('should return null error and an empty result set', function() {
        mysqlDriver.addPassword(idm_username, password, function(error, result) {
            assert.equal(null, error);
            assert.equal(0, result.length);
        });
    });
});

describe('[mysqlDriver.getUser] get a user by the idm user', function() {
    it('should return null error and a result set containing ' + username, function() {
        mysqlDriver.addPassword(idm_username, password, function(error, result) {
            assert.equal(null, error);
            assert.equal(username, result[0]);
        });
    });
});

describe('[mysqlDriver.getUserByCosmosUser] get a user by the cosmos user', function() {
    it('should return null error and a result set containing ' + username, function() {
        mysqlDriver.addPassword(idm_username, password, function(error, result) {
            assert.equal(null, error);
            assert.equal(username, result[0]);
        });
    });
});

describe('[mysqlDriver.close] close a connection', function() {
    it('should finish', function() {
        mysqlDriver.close(connectionMock);
    });
});
