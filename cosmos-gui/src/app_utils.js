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
 * Main app utils.
 *
 * Author: frb
 */

// Module dependencies
var boom = require('boom');
var cmdRunner = require('./cmd_runner.js');
var logger = require('./logger.js');

function provisionCluster(res, clusterPrivKey, clusterUser, clusterEndpoint, hdfsSuperuser, hdfsQuota, username, password) {
    cmdRunner.run('bash', ['-c', 'echo "sudo useradd ' + username + '" | ssh -i ' + clusterPrivKey + ' ' + clusterUser
    + '@' + clusterEndpoint], function(error, result) {
        if (error) {
            var boomError = boom.badData('There was an error while adding the Unix user ' + username, error);
            logger.error('There was an error while adding the Unix user ' + username + ' ' + error);
            res.status(boomError.output.statusCode).send(boomError.output.payload.message);
        } // if

        logger.info('Successful command executed: \'bash -c echo "sudo useradd ' + username + '" | ssh -i '
            + clusterPrivKey + ' ' + clusterUser + '@' + clusterEndpoint + '\'');
        cmdRunner.run('bash', ['-c', 'echo "echo ' + password + ' | sudo passwd ' + username + ' --stdin'
        + '" | ssh -i ' + clusterPrivKey + ' ' + clusterUser + '@' + clusterEndpoint], function(error, result) {
            if (error) {
                var boomError = boom.badData('There was an error while setting the password for user ' + username, error);
                logger.error('There was an error while setting the password for user ' + username);
                res.status(boomError.output.statusCode).send(boomError.output.payload.message);
            } // if

            logger.info('Successful command executed: \'bash -c echo "echo ' + password + ' | sudo passwd ' + username
                + ' --stdin' + '" | ssh -i ' + clusterPrivKey + ' ' + clusterUser + '@' + clusterEndpoint + '\'');
            cmdRunner.run('bash', ['-c', 'echo "sudo -u ' + hdfsSuperuser + ' hadoop fs -mkdir /user/' + username
            + '" | ssh -i ' + clusterPrivKey + ' ' + clusterUser + '@' + clusterEndpoint], function(error, result) {
                if (error) {
                    var boomError = boom.badData('There was an error while creating the HDFS folder for user ' + username, error);
                    logger.error('There was an error while creating the HDFS folder for user ' + username);
                    res.status(boomError.output.statusCode).send(boomError.output.payload.message);
                } // if

                logger.info('Successful command executed: \'bash -c echo "sudo -u ' + hdfsSuperuser
                    + ' hadoop fs -mkdir /user/' + username + '" | ssh -i ' + clusterPrivKey + ' ' + clusterUser + '@'
                    + clusterEndpoint + '\'');
                cmdRunner.run('bash', ['-c', 'echo "sudo -u ' + hdfsSuperuser + ' hadoop fs -chown -R ' + username
                + ':' + username + ' /user/' + username + '" | ssh -i ' + clusterPrivKey + ' ' + clusterUser + '@'
                + clusterEndpoint], function(error, result) {
                    if (error) {
                        var boomError = boom.badData('There was an error while changing the ownership of /user/' + username, error);
                        logger.error('There was an error while changing the ownership of /user/' + username);
                        res.status(boomError.output.statusCode).send(boomError.output.payload.message);
                    } // if

                    logger.info('Successful command executed: \'bash -c echo "sudo -u ' + hdfsSuperuser
                        + ' hadoop fs -chown -R ' + username + ':' + username + ' /user/' + username + '" | ssh -i '
                        + clusterPrivKey + ' ' + clusterUser + '@' + clusterEndpoint + '\'');
                    cmdRunner.run('bash', ['-c', 'echo "sudo -u ' + hdfsSuperuser + ' hadoop fs -chmod -R 740 /user/'
                    + username + '" | ssh -i ' + clusterPrivKey + ' ' + clusterUser + '@' + clusterEndpoint], function(error, result) {
                        if (error) {
                            var boomError = boom.badData('There was an error while changing the permissions to /user/' + username, error);
                            logger.error('There was an error while changing the permissions to /user/' + username);
                            res.status(boomError.output.statusCode).send(boomError.output.payload.message);
                        } // if

                        logger.info('Successful command executed: \'bash -c echo "sudo -u ' + hdfsSuperuser
                            + ' hadoop fs -chmod -R 740 /user/' + username + '" | ssh -i ' + clusterPrivKey + ' '
                            + clusterUser + '@' + clusterEndpoint + '\'');
                        cmdRunner.run('bash', ['-c', 'echo "sudo -u ' + hdfsSuperuser + ' hadoop dfsadmin -setSpaceQuota '
                        + hdfsQuota + 'g /user/' + username + '" | ssh -i ' + clusterPrivKey + ' ' + clusterUser + '@'
                        + clusterEndpoint], function(error, result) {
                            if (error) {
                                var boomError = boom.badData('There was an error while setting the quota to /user/' + username, error);
                                logger.error('There was an error while setting the quota to /user/' + username);
                                res.status(boomError.output.statusCode).send(boomError.output.payload.message);
                            } // if

                            logger.info('Successful command executed: \'bash -c echo "sudo -u ' + hdfsSuperuser
                                + ' hadoop dfsadmin -setSpaceQuota ' + hdfsQuota + 'g /user/' + username + '" | ssh -i '
                                + clusterPrivKey + ' ' + clusterUser + '@' + clusterEndpoint + '\'');
                            res.redirect('/');
                        })
                    })
                })
            })
        })
    })
} // provisionCluster

module.exports = {
    provisionCluster: provisionCluster
} // module.exports
