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
 * Http REST server for cosmos auth token generator
 *
 * Author: frb
 */

// Module dependencies
var Hapi = require('hapi');
var boom = require('boom');
var packageJson = require('../package.js');
var config = require('../conf/cosmos-auth.js');
var client = require('./client.js');
var fs = require('fs');
var logger = require('./logger.js');
var constants = require('constants');

// Create a Hapi server with a host and port
var server = new Hapi.Server();

server.connection({
    host: config.host,
    port: config.port,
    tls: {
        secureOptions: constants.SSL_OP_NO_SSLv3,
        key: fs.readFileSync(config.private_key_file),
        cert: fs.readFileSync(config.certificate_file)
    }
});

// Add routes
server.route({
    method: 'GET',
    path: '/cosmos-auth/v1/version',
    handler: function (request, reply) {
        logger.info("[user --> cosmos-auth] Request: GET /tidoop/v1/version");
        var response = '{version: ' + packageJson.version + '}';
        logger.info("[user <-- cosmos-auth] Response: " + response);
        reply(response);
    } // handler
});

server.route({
    method: 'POST',
    path: '/cosmos-auth/v1/token',
    config: {
        payload: {
            parse: 'false'
        }
    },
    handler: function(request, reply) {
        logger.info('[user --> cosmos-auth] Request: POST /cosmos-auth/v1/token');
        logger.info('[user --> cosmos-auth] ' + JSON.stringify(request.headers));
        logger.info('[user --> cosmos-auth] ' + request.payload.toString());

        // Check the request parameters
        // TBD

        // POST to the IdM token-related API
        client.doAuthorizedRequest(config.idm.host, config.idm.port, config.idm.path, 'POST',
            config.cosmos_app.client_id, config.cosmos_app.client_secret, request.payload.toString(),
            function(error, result) {
                if (error) {
                    logger.error('Could not connect to the IdM', error);
                    reply(boom.internal('Could not connect to the IdM', error));
                } else {
                    logger.info('[user <-- cosmos-auth] Response: ' + result);
                    reply(result);
                } // if else
            })
    } // handler
});

// Start the Hapi server
server.start(function(error) {
    if(error) {
        return logger.error('Some error occurred during the starting of the Hapi server. Details: ' + error);
    } // if

    logger.info('cosmos-auth running at http://' + config.host + ':' + config.port);
});
