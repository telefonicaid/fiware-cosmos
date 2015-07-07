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
var packageJson = require('../package.json');
var config = require('../conf/cosmos-auth.json');
var client = require('./client.js');

// Create a Hapi server with a host and port
var server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: config.port
});

// Add routes
server.route({
    method: 'GET',
    path: '/cosmos-auth/v1/version',
    handler: function (request, reply) {
        console.log("[user --> cosmos-auth] Request: GET /tidoop/v1/version");
        var response = '{version: ' + packageJson.version + '}';
        console.log("[user <-- cosmos-auth] Response: " + response);
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
        console.log('[user --> cosmos-auth] Request: POST /cosmos-auth/v1/token');
        console.log('[user --> cosmos-auth] ' + JSON.stringify(request.headers));
        console.log('[user --> cosmos-auth] ' + request.payload.toString());

        // Check the request parameters
        // TBD

        // POST to the IdM token-related API
        client.doAuthorizedRequest(config.idm.host, config.idm.port, config.idm.path, 'POST',
            config.cosmos_app.client_id, config.cosmos_app.client_secret, request.payload.toString(),
            function(error, result) {
                if (error) {
                    reply(boom.internal('Could not connect to the IdM', error));
                } else {
                    console.log('[user <-- cosmos-auth] Response: ' + result);
                    reply(result);
                } // if else
            })
    } // handler
});

// Start the Hapi server
server.start(function(error) {
    if(error) {
        return console.log("Some error occurred during the starting of the Hapi server. Details: " + error);
    } // if

    console.log("cosmos-auth running at http://localhost:" + config.port);
});
