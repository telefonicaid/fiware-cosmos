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
 * logger tests
 *
 * Author: frb
 */

// Module dependencies
var fs = require('fs');
var assert = require('assert');
var rewire = require('rewire');
var logger = rewire('../../src/logger.js');

// Testing variables
var message = 'Test message';
var logLevel = 'WARN';

// Mock Winston
var winstonMock = {
    error: function(message) {
        fs.writeFile('/tmp/logger_test_error.txt', message, function(error) {
            if (error) throw error;
        });
    }, // error

    warn: function(message) {
        fs.writeFile('/tmp/logger_test_warn.txt', message, function(error) {});
    }, // warn

    info: function(message) {
        fs.writeFile('/tmp/logger_test_info.txt', message, function(error) {});
    }, // info

    debug: function(message) {
        fs.writeFile('/tmp/logger_test_debug.txt', message, function(error) {});
    } // debug
};
logger.__set__('winston', winstonMock);

// Mock the log level
logger.__set__('logLevel', logLevel);

// Tests suite
describe('[logger.error] log with error level', function() {
    it('should print \'' + message + '\' when using ' + logLevel + ' level', function () {
        logger.error(message);
        fs.readFile('/tmp/logger_test_error.txt', 'utf8', function(error, data) {
            if (error) {
                assert.equal(true, false);
            } else {
                assert.equal(data, message);
            } // if
        });
    });
});

describe('[logger.warn] log with warn level', function() {
    it('should print \'' + message + '\' when using ' + logLevel + ' level', function () {
        logger.error(message);
        fs.readFile('/tmp/logger_test_warn.txt', 'utf8', function(error, data) {
            if (error) {
                assert.equal(true, false);
            } else {
                assert.equal(data, message);
            } // if
        });
    });
});

describe('[logger.info] log with info level', function() {
    it('should not print \'' + message + '\' when using ' + logLevel + ' level', function () {
        logger.error(message);
        fs.readFile('/tmp/logger_test_info.txt', 'utf8', function(error, data) {
            if (error) {
                assert.equal(true, false);
            } else {
                assert.equal(data, '');
            } // if
        });
    });
});

describe('[logger.debug] log with debug level', function() {
    it('should print \'' + message + '\' when using ' + logLevel + ' level', function () {
        logger.error(message);
        fs.readFile('/tmp/logger_test_debug.txt', 'utf8', function(error, data) {
            if (error) {
                assert.equal(true, false);
            } else {
                assert.equal(data, '');
            } // if
        });
    });
});
