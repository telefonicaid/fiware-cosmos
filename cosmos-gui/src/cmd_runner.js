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
 * Command runner.
 *
 * Author: frb
 */

// Module dependencies
var spawn = require('child_process').spawn;

function run(cmd, params, callback) {
    var execution = spawn(cmd, params);
    var result = '';

    execution.stdout.on('data', function (data) {
        result += 'stdout: ' + data.toString();
    });

    execution.stderr.on('data', function (data) {
        result += 'stderr: ' + data.toString();
    });

    execution.on('close', function (code) {
        return callback(null, result);
    });
} // run

module.exports = {
    run: run
} // module.exports
