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
 * cosmos-gui main app
 *
 * Author: frb
 */

// Module dependencies
var express = require('express');
var boom = require('express-boom');
var stylus = require('stylus');
var nib = require('nib');
var config = require('../conf/cosmos-gui.json');
var mysqlDriver = require('./mysql_driver.js');
var OAuth2 = require('./oauth2').OAuth2;
var cmdRunner = require('./cmd_runner.js');

// Express configuration
var app = express();

app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');
app.use(boom());
app.use(express.logger());
app.use(stylus.middleware(
    { src: __dirname + '/../public',
        compile: compile
    }
));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: "skjghskdjfhbqigohqdiouk"}));
app.configure(function () {
    "use strict";
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(express.static(__dirname + '/../public'));
});

function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib());
}

// Global variables
var port = config.gui.port;
var client_id = config.oauth2.client_id;
var client_secret = config.oauth2.client_secret;
var idmURL = config.oauth2.idmURL;
var response_type = config.oauth2.response_type;
var callbackURL = config.oauth2.callbackURL;
var hdfsQuota = config.hdfs.quota;

// Creates oauth library object with the config data
var oa = new OAuth2(client_id,
    client_secret,
    idmURL,
    '/oauth2/authorize',
    '/oauth2/token',
    callbackURL);

// Handles requests to the main page
app.get('/', function (req, res) {
    var access_token = req.session.access_token;

    // Check if the user had a session
    if (access_token) {
        // Get user information given its access token
        oa.get(idmURL + '/user/', access_token, function (error, response) {
            if (error) {
                res.boom.notFound('There was some error when getting user information from the IdM', error);
                return;
            } else {
                // Get the user's IdM email (username)
                var idm_username = JSON.parse(response).email;
                req.session.idm_username = idm_username;

                // Check if the user, given its IdM username, has a Cosmos account
                mysqlDriver.getUser(idm_username, function(error, result) {
                    if (error) {
                        res.boom.badData('There was some error when getting user information from the ' +
                            'database', error);
                        return;
                    } else if (result[0]) {
                        if (result[0].password) {
                            res.render('dashboard'); // both old and new Cosmos users with password
                        } else {
                            res.render('new_password'); // old Cosmos users not having a password
                        } // if else
                    } else {
                        res.render('new_account'); // new Cosmos users not having a username
                    } // if else
                });
            } // if else
        });
    } else {
        res.render('login');
    } // if else
});

// Redirection to IDM authentication portal
app.get('/login', function(req, res) {
    var path = oa.getAuthorizeUrl(response_type);
    res.redirect(path);
});

// Handles requests from IDM with the access code
app.get('/auth', function(req, res) {
    // Using the access code goes again to the IDM to obtain the access_token
    oa.getOAuthAccessToken(req.query.code, function (e, results){
    // Stores the access_token in a session cookie
        req.session.access_token = results.access_token;
        res.redirect('/');
    });
});

app.post('/new_account', function(req, res) {
    var idm_username = req.session.idm_username;
    var username = idm_username.split('@')[0];
    var password1 = req.body.password1;
    var password2 = req.body.password2;

    if (password1 === password2) {
        mysqlDriver.addUser(idm_username, username, password1, function(error, result) {
            if (error) {
                res.boom.badData('There was some error when adding information in the database for user ' + username, error);
                return;
            } // if

            cmdRunner.run('bash', ['-c', 'useradd ' + username], function(error, result) {
                if (error) {
                    res.boom.badData('There was an error while adding the Unix user ' + username, error);
                    return;
                } // if

                console.log('Successful command executed: \'bash -c useradd ' + username + '\'');
                cmdRunner.run('bash', ['-c', 'echo ' + password1 + ' | passwd ' + username + ' --stdin'], function(error, result) {
                    if (error) {
                        res.boom.badData('There was an error while setting the password for user ' + username, error);
                        return;
                    } // if

                    console.log('Successful command executed: \'bash -c echo ' + password1 + ' | passwd ' + username + ' --stdin\'');
                    cmdRunner.run('bash', ['-c', 'sudo -u hdfs hadoop fs -mkdir /user/' + username], function(error, result) {
                        if (error) {
                            res.boom.badData('There was an error while creating the HDFS folder for user ' + username, error);
                            return;
                        } // if

                        console.log('Successful command executed: \'bash -c sudo -u hdfs hadoop fs -mkdir /user/' + username + '\'');
                        cmdRunner.run('bash', ['-c', 'sudo -u hdfs hadoop fs -chown -R ' + username + ':' + username + ' /user/' + username], function(error, result) {
                            if (error) {
                                res.boom.badData('There was an error while changing the ownership of /user/' + username, error);
                                return;
                            } // if

                            console.log('Successful command executed: \'bash -c sudo -u hdfs hadoop fs -chown -R ' + username + ':' + username + ' /user/' + username + '\'');
                            cmdRunner.run('bash', ['-c', 'sudo -u hdfs hadoop fs -chmod -R 740 /user/' + username], function(error, result) {
                                if (error) {
                                    res.boom.badData('There was an error while changing the permissions to /user/' + username, error);
                                    return;
                                } // if

                                console.log('Successful command executed: \'bash -c sudo -u hdfs hadoop fs -chmod -R 740 /user/' + username + '\'');
                                cmdRunner.run('bash', ['-c', 'sudo -u hdfs hadoop dfsadmin -setSpaceQuota ' + hdfsQuota + 'g /user/' + username], function(error, result) {
                                    if (error) {
                                        res.boom.badData('There was an error while setting the quota to /user/' + username, error);
                                        return;
                                    } // if

                                    console.log('Successful command executed: \'bash -c sudo -u hdfs hadoop dfsadmin -setSpaceQuota ' + hdfsQuota + 'g /user/' + username + '\'');
                                    res.redirect('/');
                                })
                            })
                        })
                    })
                })
            })
        });
    } else {
        res.redirect('/');
    } // if else
});

app.post('/new_password', function(req, res) {
    var idm_username = req.session.idm_username;
    var username = idm_username.split('@')[0];
    var password1 = req.body.password1;
    var password2 = req.body.password2;

    if (password1 === password2) {
        mysqlDriver.addPassword(idm_username, password1, function(error, result) {
            if (error) {
                res.boom.badData('There was an error while setting up the password for user ' + username, error);
                return;
            } else {
                res.redirect('/');
            } // if else
        })
    } else {
        res.redirect('/');
    } // if else
});

// Handles logout requests to remove access_token from the session cookie
app.get('/logout', function(req, res){
    req.session.access_token = undefined;
    res.redirect('/');
});

// Create a permanent connection to MySQL, and start the server
mysqlDriver.connect(function(error, result) {
    if (error) {
        console.log('There was some error when connecting to MySQL database. The server will not be run. ' +
            'Details: ' + error);
    } else {
        // Start the application, listening at the configured port
        console.log("cosmos-gui running at http://localhost:" + port);
        app.listen(port);
    } // if else
});
