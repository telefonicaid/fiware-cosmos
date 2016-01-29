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
var mysqlDriver = require('./mysql_driver.js');
var usersBlacklist = require('../conf/cosmos-gui.json').users_blacklist;

function provisionCluster(res, clusterPrivKey, clusterUser, clusterEndpoint, hdfsSuperuser, hdfsQuota, username, password) {
    cmdRunner.run('ssh', ['-tt', '-i', clusterPrivKey, clusterUser + '@' + clusterEndpoint,
        'echo \'sudo useradd ' + username + '\' | sudo bash'], function(error, result) {
        if (error) {
            var boomError = boom.badData('There was an error while adding the Unix user ' + username, error);
            logger.error('There was an error while adding the Unix user ' + username + ' ' + error);
            res.status(boomError.output.statusCode).send(boomError.output.payload.message);
            return;
        } // if

        logger.info('Successful command executed: \'ssh -tt -i ' + clusterPrivKey + ' ' + clusterUser + '@' + clusterEndpoint
            + ' \"echo \'sudo useradd ' + username + '\' | sudo bash\"\'');
        cmdRunner.run('ssh', ['-tt', '-i', clusterPrivKey, clusterUser + '@' + clusterEndpoint,
            'echo ' + password + ' | sudo passwd ' + username + ' --stdin'], function(error, result) {
            if (error) {
                var boomError = boom.badData('There was an error while setting the password for user ' + username, error);
                logger.error('There was an error while setting the password for user ' + username);
                res.status(boomError.output.statusCode).send(boomError.output.payload.message);
                return;
            } // if

            logger.info('Successful command executed: \'ssh -tt -i ' + clusterPrivKey + ' ' + clusterUser + '@' + clusterEndpoint
                + ' \"echo ' + password + ' | sudo passwd ' + username + ' --stdin | sudo bash\"\'');
            cmdRunner.run('ssh', ['-tt', '-i', clusterPrivKey, clusterUser + '@' + clusterEndpoint,
                'echo \'sudo -u ' + hdfsSuperuser + ' hadoop fs -mkdir /user/' + username + '\' | sudo bash'], function(error, result) {
                if (error) {
                    var boomError = boom.badData('There was an error while creating the HDFS folder for user ' + username, error);
                    logger.error('There was an error while creating the HDFS folder for user ' + username);
                    res.status(boomError.output.statusCode).send(boomError.output.payload.message);
                    return;
                } // if

                logger.info('Successful command executed: \'ssh -tt -i ' + clusterPrivKey + ' ' + clusterUser + '@' + clusterEndpoint
                    + ' \"echo \'sudo -u ' + hdfsSuperuser + ' hadoop fs -mkdir /user/' + username + '\' | sudo bash\"\'');
                cmdRunner.run('ssh', ['-tt', '-i', clusterPrivKey, clusterUser + '@' + clusterEndpoint,
                    'echo \'sudo -u ' + hdfsSuperuser + ' hadoop fs -chown -R ' + username + ':' + username + ' /user/' + username
                    + '\' | sudo bash'], function(error, result) {
                    if (error) {
                        var boomError = boom.badData('There was an error while changing the ownership of /user/' + username, error);
                        logger.error('There was an error while changing the ownership of /user/' + username);
                        res.status(boomError.output.statusCode).send(boomError.output.payload.message);
                        return;
                    } // if

                    logger.info('Successful command executed: \'ssh -tt -i ' + clusterPrivKey + ' ' + clusterUser + '@'
                        + clusterEndpoint + ' \"echo \'sudo -u ' + hdfsSuperuser + ' hadoop fs -chown -R ' + username + ':'
                        + username + ' /user/' + username + '\' | sudo bash\"\'');
                    cmdRunner.run('ssh', ['-tt', '-i', clusterPrivKey, clusterUser + '@' + clusterEndpoint,
                        'echo \'sudo -u ' + hdfsSuperuser + ' hadoop fs -chmod -R 740 /user/' + username + '\' | sudo bash'],
                        function(error, result) {
                        if (error) {
                            var boomError = boom.badData('There was an error while changing the permissions to /user/' + username, error);
                            logger.error('There was an error while changing the permissions to /user/' + username);
                            res.status(boomError.output.statusCode).send(boomError.output.payload.message);
                            return;
                        } // if

                        logger.info('Successful command executed: \'ssh -tt -i ' + clusterPrivKey + ' ' + clusterUser + '@'
                            + clusterEndpoint + ' \"echo \'sudo -u ' + hdfsSuperuser + ' hadoop fs -chmod -R 740 /user/'
                            + username + '\' | sudo bash\"\'');
                        cmdRunner.run('ssh', ['-tt', '-i', clusterPrivKey, clusterUser + '@' + clusterEndpoint,
                            'echo \'sudo -u ' + hdfsSuperuser + ' hadoop dfsadmin -setSpaceQuota ' + hdfsQuota + 'g /user/'
                            + username + '\' | sudo bash'], function(error, result) {
                            if (error) {
                                var boomError = boom.badData('There was an error while setting the quota to /user/' + username, error);
                                logger.error('There was an error while setting the quota to /user/' + username);
                                res.status(boomError.output.statusCode).send(boomError.output.payload.message);
                                return;
                            } // if

                            logger.info('Successful command executed: \'ssh -tt -i ' + clusterPrivKey + ' ' + clusterUser + '@'
                                + clusterEndpoint + ' \"echo \'sudo -u ' + hdfsSuperuser + ' hadoop dfsadmin -setSpaceQuota '
                                + hdfsQuota + 'g /user/' + username + '\' | sudo bash\"\'');
                        })
                    })
                })
            })
        })
    })
} // provisionCluster

function provisionPassword(res, clusterPrivKey, clusterUser, clusterEndpoint, username, password) {
    cmdRunner.run('ssh', ['-tt', '-i', clusterPrivKey, clusterUser + '@' + clusterEndpoint,
        'echo ' + password + ' | sudo passwd ' + username + ' --stdin'], function(error, result) {
        if (error) {
            var boomError = boom.badData('There was an error while setting the password for user ' + username, error);
            logger.error('There was an error while setting the password for user ' + username);
            res.status(boomError.output.statusCode).send(boomError.output.payload.message);
            return;
        } // if

        logger.info('Successful command executed: \'ssh -tt -i ' + clusterPrivKey + ' ' + clusterUser + '@' + clusterEndpoint
            + ' \"echo ' + password + ' | sudo passwd ' + username + ' --stdin | sudo bash\"\'');
    })
} // provisionPassword

module.exports = {
    provisionCluster: provisionCluster,
    provisionPassword: provisionPassword
} // module.exports
