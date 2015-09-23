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
 * app_utils tests
 *
 * Author: frb
 */

// Module dependencies
var assert = require('assert');
var rewire = require('rewire');
var appUtils = rewire('../../src/app_utils.js');

// Testing variables
var baseUsername = 'frb';
var builtUsername = 'frb1';
var invalidBaseUsername = 'fiware';
var pathBefore = '/before';
var pathAfter = '/after';
var res = {url: pathBefore, redirect: function(path) {res.url = pathAfter;}};
var clusterPrivKey = './priv_key';
var clusterUser = 'admin';
var clusterEndpoint = 'fake.cosmos.lab.fiware.org';
var hdfsSuperuser = 'hdfs';
var hdfsQuota = 5;
var username = 'frb';
var password = '12345';

// Mock the MySQL driver
var numCalls = 0;
var mysqlDriverMock = {
    getUserByCosmosUser: function(baseUsername, callback) {
        switch (numCalls) {
            case 0:
                numCalls++;
                callback(null, [baseUsername]);
                break;
            case 1:
                numCalls = 0;
                callback(null, []);
                break;
        } // switch
    } // getUserByCosmosUser
};
appUtils.__set__('mysqlDriver', mysqlDriverMock);

// Mock the users blacklist
appUtils.__set__('usersBlacklist', ['fiware']);

// Mock the CMD runner
var cmdRunnerMock = {
    run: function(cmd, params, callback) {
        return callback(null, 'done');
    } // run
};
appUtils.__set__('cmdRunner', cmdRunnerMock);

// Tests suite
describe('[appUtils.buildUsername] build a username from a valid base string', function() {
    it('should return ' + builtUsername + ' when ' + baseUsername + ' is used as base string', function () {
        appUtils.buildUsername(baseUsername, 0, function(username) {
            assert.equal(builtUsername, username);
        });
    });
});

describe('[appUtils.buildUsername] build an invalid username from an invalid base string', function() {
    it('should return null when ' + invalidBaseUsername + ' is used as base string', function () {
        appUtils.buildUsername(invalidBaseUsername, 0, function(username) {
            assert.equal(null, username);
        });
    });
});

describe('[appUtils.provisionCluster] provision a cluster', function() {
    it('should redirect to ' + pathAfter + ' when being called from ' + pathBefore, function () {
        appUtils.provisionCluster(res, clusterPrivKey, clusterUser, clusterEndpoint, hdfsSuperuser, hdfsQuota, username, password);
        assert.equal(pathAfter, res.url);
    });
});