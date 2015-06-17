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
 * Http server for "Tidoop MR job library" REST API
 *
 * Author: frb
 */

// module dependencies
var express = require('express');
var session = require('express-session');
var stylus = require('stylus');
var nib = require('nib');
var bodyParser = require('body-parser');
var config = require('../conf/cosmos-gui.json');
var mysql = require('./mysql.js');

// main application, it is based on Express
var app = express();

// create a permanent connection to MySQL
var connection = mysql.createConnection();

function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib());
}

// set Jade as view engine
app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');

// set the chain of Express middlewares
app.use(session({secret: '8sjw74q91knnv7n23jjsd7k2flfka8a91k110'}));
//app.use(express.logger('dev'));
app.use(stylus.middleware(
    { src: __dirname + '/../public',
        compile: compile
    }
));
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.urlencoded({ extended: false }));

// session
var sess;

// create routes for the application
app.get('/', function (req, res) {
    sess = req.session;

    // check if the user had a session
    if (sess.username) {
        res.redirect('dashboard');
    } else {
        res.redirect('https://account.lab.fiware.org');
    } // if else
});

app.get('/callback', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (mysql.exists(connection, username, password)) {
        res.render('dashboard');
    } else {
        res.render('new_account');
    } // if else
});

// start the application, listening at the configured port
app.listen(config.cosmos_gui.port);