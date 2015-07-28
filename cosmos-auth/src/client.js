/**
 * Copyright 2015 Telefonica Investigación y Desarrollo, S.A.U
 *
 * This file is part of fiware-cosmos (FI-WARE project).
 *
 * fiware-cosmos is free software: you can redistribute it and/or modify it under the terms of the GNU Affero
 * General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 * fiware-tidoop is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the
 * implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with fiware-cosmos. If not, see
 * http://www.gnu.org/licenses/.
 *
 * For those usages not covered by the GNU Affero General Public License please contact with
 * francisco dot romerobueno at telefonica dot com
 */

/**
 * Http REST client
 *
 * Author: frb
 */

// Module dependencies
var https = require('https');
var logger = require('./loggerjs');

function doAuthorizedRequest(host, port, path, method, clientId, clientSecret, data, callback) {
    logger.info('[cosmos-auth -> IdM] Request: ' + method + ' https://' + host + ':' + port + path);

    var headers = {
        'Authorization': 'Basic ' + new Buffer(clientId + ":" + clientSecret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data, 'utf8')
    }

    logger.info('[cosmos-auth -> IdM] ' + JSON.stringify(headers));
    logger.info('[cosmos-auth -> IdM] ' + data);

    var options = {
        host : host,
        port : port,
        path : path,
        method : method,
        headers: headers
    };

    var request = https.request(options, function(response) {
        var result = '';

        response.on('data', function(data) {
            result = data.toString();
        });

        response.on('end', function() {
            logger.info('[cosmos-auth <- IdM] Response: ' + result)
            callback(null, result);
        });
    });

    request.write(data);
    request.end();

    request.on('error', function(error) {
        callback(error);
    });
} // doRequest


module.exports = {
    doAuthorizedRequest: doAuthorizedRequest
}
