/**
 * Copyright 2016 Telefonica Investigación y Desarrollo, S.A.U
 *
 * This file is part of fiware-cosmos (FI-WARE project).
 *
 * fiware-cosmos is free software: you can redistribute it and/or modify it under the terms of the GNU Affero
 * General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 * fiware-cosmos is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the
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
 * Http server for Tidoop REST API
 *
 * Author: frb
 */

// Module dependencies
var Hapi = require('hapi');
var cmdRunner = require('./cmd_runner.js');
var packageJson = require('../package.js');
var config = require('../conf/cosmos-tidoop-api.js');
var logger = require('./logger.js');

// Create a Hapi server with a host and port
var server = new Hapi.Server();

server.connection({ 
    host: config.host,
    port: config.port
});

// Add routes
server.route({
    method: 'GET',
    path: '/tidoop/v1/version',
    handler: function (request, reply) {
        logger.info("Request: GET /tidoop/v1/version");
        var response = '{"success":"true","version": "' + packageJson.version + '"}';
        logger.info("Response: " + response);
        reply(response);
    } // handler
});

server.route({
    method: 'POST',
    path: '/tidoop/v1/user/{userId}/jobs',
    handler: function (request, reply) {
        var userId = request.params.userId;

        if (typeof request.payload.jar === 'undefined') {
            var response = '{"success":"false","error":"jar not found in the request"}';
            logger.info(response);
            reply(response);
            return;
        } // if

        var jarInHDFS = 'hdfs://' + config.storage_cluster.namenode_host + ':'
            + config.storage_cluster.namenode_ipc_port + '/user/' + userId + '/' + request.payload.jar;
        var splits = request.payload.jar.split("/");
        var jarName = splits[splits.length - 1];

        if (typeof request.payload.class_name === 'undefined') {
            var response = '{"success":"false","error":"class name not found in the request"}';
            logger.info(response);
            reply(response);
            return;
        } // if

        var className = request.payload.class_name;

        var libJarsName = jarName;
        var libJarsInHDFS = jarInHDFS;

        if (typeof request.payload.args === 'undefined') {
            var response = '{"success":"false","error":"args not found in the request"}';
            logger.info(response);
            reply(response);
            return;
        } // if

        var args = request.payload.args;
        var modArgs = '';

        for (var i = 0; i < args.length; i++) {
            if (modArgs.length == 0) {
                modArgs += args[i].replace('storage.cosmos.lab.fiware.org', config.storage_cluster.namenode_host + ':'
                    + config.storage_cluster.namenode_ipc_port);
            } else {
                modArgs += " " + args[i].replace('storage.cosmos.lab.fiware.org', config.storage_cluster.namenode_host
                        + ':' + config.storage_cluster.namenode_ipc_port);
            } // if else
        } // for

        logger.info('Request: POST /tidoop/v1/user/' + userId + '/jobs ' + request.payload);

        cmdRunner.runHadoopJar(userId, jarName, jarInHDFS, className, libJarsName, libJarsInHDFS, modArgs,
            function(error, result) {
                if (error) {
                    var response = '{"success":"false","error":' + error + '}';
                    logger.info(response);
                    reply(response);
                } else {
                    var response = '{"success":"true","job_id": "' + result + '"}';
                    logger.info("Response: " + response);
                    reply(response);
                } // if else
            });
    } // handler
});

server.route({
    method: 'GET',
    path: '/tidoop/v1/user/{userId}/jobs',
    handler: function(request, reply) {
        var userId = request.params.userId;

        logger.info('Request: GET /tidoop/v1/user/' + userId + '/jobs');

        cmdRunner.runHadoopJobList(userId, false, function (error, result) {
            if (error) {
                var response = '{"success":"false","error":"The user ID does not exist"}';
                logger.info(response);
                reply(response);
            } else {
                var response = '{"success":"true","jobs":' + result + '}';
                logger.info(response);
                reply(response);
            } // if else
        });
    } // handler
});

server.route({
    method: 'GET',
    path: '/tidoop/v1/user/{userId}/jobs/{jobId}',
    handler: function (request, reply) {
        var userId = request.params.userId;
        var jobId = request.params.jobId;

        logger.info('Request: GET /tidoop/v1/user/' + userId + '/jobs/' + jobId);

        cmdRunner.runHadoopJobList(userId, true, function (error, result) {
            if (error) {
                var response = '{"success":"false","error":"The user ID does not exist"}';
                logger.info(response);
                reply(response);
            } else {
                var jsonResult = JSON.parse(result);
                var job = null;

                for (i in jsonResult) {
                    if (jsonResult[i].job_id === jobId) {
                        job = jsonResult[i];
                    } // if
                } // for

                if (job === null) {
                    var response = '{"success":"false","error":"The job ID does not exist"}';
                    logger.info(response);
                    reply(response);
                } else {
                    var response = '{"success":"true","job":' + JSON.stringify(job) + '}';
                    logger.info(response);
                    reply(response);
                } // if else
            } // if else
        });
    } // handler
});

server.route({
    method: 'DELETE',
    path: '/tidoop/v1/user/{userId}/jobs',
    handler: function(request, reply) {
        var userId = request.params.userId;

        logger.info('Request: DELETE /tidoop/v1/user/' + userId + '/jobs');

        var response = '{"success":"false","error":"Not yet supported"}';
        logger.info("Response: " + response);
        reply(response);
    } // handler
});

server.route({
    method: 'DELETE',
    path: '/tidoop/v1/user/{userId}/jobs/{jobId}',
    handler: function(request, reply) {
        var userId = request.params.userId;
        var jobId = request.params.jobId;

        logger.info('Request: DELETE /tidoop/v1/user/' + userId + '/jobs/' + jobId);

        cmdRunner.runHadoopJobKill(jobId, function(error) {
            if (error) {
                var response = '{"success":"false","error":"The job ID does not exist"}';
                logger.info("Response: " + response);
                reply(response);
            } else {
                var response = '{"success":"true"}';
                logger.info("Response: " + response);
                reply(response);
            } // if else
        });
    } // handler
});

// Start the Hapi server
server.start(function(error) {
    if(error) {
        logger.error("Some error occurred during the starting of the Hapi server. Details: " + error);
    } else {
        logger.info("tidoop-mr-lib-api running at http://" + config.host + ":" + config.port);
    } // if else
});
