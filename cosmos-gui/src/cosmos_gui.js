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
var https = require('https');
var fs = require('fs');
var boom = require('boom');
var stylus = require('stylus');
var nib = require('nib');
var config = require('../conf/cosmos-gui.json');
var mysqlDriver = require('./mysql_driver.js');
var OAuth2 = require('./oauth2').OAuth2;
var logger = require('./logger.js');
var appUtils = require('./app_utils.js');
var constants = require('constants');

// Global variables
var port = config.gui.port;
var client_id = config.oauth2.client_id;
var client_secret = config.oauth2.client_secret;
var idmURL = config.oauth2.idmURL;
var response_type = config.oauth2.response_type;
var callbackURL = config.oauth2.callbackURL;
var hdfsQuota = config.hdfs.quota;
var hdfsSuperuser = config.hdfs.superuser;
var scPrivKey = config.clusters.storage.private_key;
var scUser = config.clusters.storage.user;
var scEndpoint = config.clusters.storage.endpoint;
var ccPrivKey = config.clusters.computing.private_key;
var ccUser = config.clusters.computing.user;
var ccEndpoint = config.clusters.computing.endpoint;
var httpsOptions = {
    secureOptions: constants.SSL_OP_NO_SSLv3,
    key: fs.readFileSync(config.gui.private_key_file),
    cert: fs.readFileSync(config.gui.certificate_file)
}

// Express configuration
var app = express();

app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');
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
                var boomError = boom.badData('There was some error when getting user information from the IdM', error);
                logger.error('There was some error when getting user information from the IdM', error);
                res.status(boomError.output.statusCode).send(boomError.output.payload.message);
            } else {
                // Get the user's IdM email (username)
                var jsonResponse = JSON.parse(response);
                var user_id = jsonResponse.id;
                var user_email = jsonResponse.email;
                req.session.user_email = user_email;
                req.session.user_id = user_id;

                // Check if the user, given its IdM id, has a Cosmos account
                mysqlDriver.getUser(user_id, function(error, result) {
                    if (error) {
                        var boomError = boom.badData('There was some error when getting user information from the ' + 'database', error);
                        logger.error('There was some error when getting user information from the ' + 'database', error);
                        res.status(boomError.output.statusCode).send(boomError.output.payload.message);
                    } else if (result[0]) {
                        req.session.username = result[0].username;
                        res.render('dashboard');
                    } else {
                        res.redirect('new_account');
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
    oa.getOAuthAccessToken(req.query.code, function (e, results) {
        if (results) {
            if ('access_token' in results) {
                // Stores the access_token in a session cookie
                req.session.access_token = results.access_token;
            } // if
        } // if

        res.redirect('/');
    });
});

app.get('/new_account', function(req, res) {
    var user_id = req.session.user_id;
    var user_email = req.session.user_email;

    mysqlDriver.addUser(user_id, user_email, hdfsQuota, function(error, result) {
        if (error) {
            var boomError = boom.badData('There was some error when adding information in the database for user '+ user_id, error);
            logger.error('There was some error when adding information in the database for user '+ user_id);
            res.status(boomError.output.statusCode).send(boomError.output.payload.message);
        } else {
            logger.info('Successful information added to the database for user ' + user_id);

            if (scEndpoint === ccEndpoint) {
                // Just one provision step instead of two
                appUtils.provisionCluster(res, scPrivKey, scUser, scEndpoint, hdfsSuperuser, hdfsQuota, user_id);
            } else {
                // Two different provision steps
                appUtils.provisionCluster(res, scPrivKey, scUser, scEndpoint, hdfsSuperuser, hdfsQuota, user_id);
                appUtils.provisionCluster(res, ccPrivKey, ccUser, ccEndpoint, hdfsSuperuser, hdfsQuota, user_id);
            } // if else

            res.redirect('/');
        } // if else
    });
});

app.get('/dashboard', function(req, res) {
    res.render('dashboard');
});

app.get('/profile', function(req, res) {
    var user_id = req.session.user_id;

    mysqlDriver.getUser(user_id, function(error, result) {
        if (error) {
            var boomError = boom.badData('There was an error while retrieving profile for user ' + user_id, error);
            logger.error('There was an error while retrieving profile for user ' + user_id, error);
            res.status(boomError.output.statusCode).send(boomError.output.payload.message);
        } else {
            res.render('profile', { "results": result });
        } // if else
    })
});

// Handles logout requests to remove access_token from the session cookie
app.get('/logout', function(req, res){
    req.session.access_token = undefined;
    res.redirect('/');
});

// Start the application, listening at the configured port
logger.info("cosmos-gui running at https://localhost:" + port);
https.createServer(httpsOptions, app).listen(port);
