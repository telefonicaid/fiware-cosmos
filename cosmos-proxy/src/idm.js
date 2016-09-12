/**
 * Copyright 2016 Telefonica Investigación y Desarrollo, S.A.U
 *
 * This file is part of frb-cosmos-proxy.
 *
 * frb-cosmos-proxy is free software: you can redistribute it and/or modify it under the terms of the GNU Affero
 * General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 * frb-cosmos-proxy is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the
 * implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with frb-cosmos-proxy. If not, see
 * http://www.gnu.org/licenses/.
 *
 * For those usages not covered by the GNU Affero General Public License please contact with
 * frnacisco dot romerobueno at telefonica dot com
 */

/**
 * Author: frbattid
 */

var https = require('https'),
    idm = require('../conf/cosmos-proxy.json').idm;

function authenticate(token, callback) {
    var options = {
        host : idm.host,
        port: idm.port,
        path : '/user?access_token=' + token,
        method : 'GET'
    };

    var request = https.request(options, function(response) {
        var result = '';

        response.on('data', function(data) {
            result = data.toString();
        });

        response.on('end', function() {
            callback(null, result);
        });
    });

    request.on('error', function(error) {
        callback(error);
    });

    request.end();
} // doRequest


module.exports = {
    authenticate: authenticate
} // module.exports
