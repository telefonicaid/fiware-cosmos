/**
 * Copyright 2016 Telefonica Investigación y Desarrollo, S.A.U
 *
 * This file is part of frb-cosmos-proxy.
 *
 * frb-cosmos-proxy is free software: you can redistribute it and/or modify it under the terms of the GNU Affero
 * General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 * frb-cosmos-proy is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the
 * implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with frb-cosmos-proxy. If not, see
 * http://www.gnu.org/licenses/.
 *
 * For those usages not covered by the GNU Affero General Public License please contact with
 * francisco dot romerobueno at telefonica dot com
 */

/**
 * Author: frbattid
 */

var http = require('http'),
    httpProxy = require('http-proxy'),
    url = require('url'),
    idm = require('./idm.js'),
    conf = require('../conf/cosmos-proxy.json'),
    cache = require('./cache.js'),
    tidoopfs = require('./tidoopfs.js'),
    helper = require('./conf_helper'),
    logger = require('./logger.js');

var validConfig = helper.checkConfFile();

if (!validConfig) {
    process.stdout.write('Unable to start the proxy: Configuration file has missing information.\n');
    process.exit();
} // if

logger.info('Starting cosmos-proxy in ' + conf.host + ':' + conf.port);
var proxy = httpProxy.createProxyServer({});

// Unnecessary, but do not disturb
if (cache.isCacheEmpty()) {
    if (tidoopfs.fileExists()) {
        if (!tidoopfs.isEmptyFile()) {
            cache.loadCacheData();
            logger.info('Loading cache from cache-dump file');
        } else {
            logger.info('Empty \'cache-dump\' file. Starting an empty cache.');
        } // if else
    } else {
        try {
            cache.createEmptyFileCache();
            logger.info('\'cache-dump\' file not found. Starting an empty cache.');
        } catch (e) {
            logger.info('Cannot access to \'/etc/cosmos/cosmos-proxy\'. Starting cosmos-proxy without file support.');
        } // try catch
    } // if else
} // if

function isWhiteListed(list, path) {
    for(var i = 0; i < list.length; i++) {
        if ('/webhdfs/v1/user/' + list[i] == path) {
            return true;
        } // if
    } // for

    return false;
} // isWhiteListed

function isAuthorized(username, path) {
    var whiteListed = isWhiteListed(conf.public_paths_list, path);

    if (path === '/webhdfs/v1' || path === '/webhdfs/v1/' || path === '/webhdfs/v1/user'
        || path === '/webhdfs/v1/user/') {
        return false;
    } else if (whiteListed) {
        return true;
    } else {
        if (username === conf.superuser) {
            return true;
        } else {
            return (path === '/webhdfs/v1/user/' + username
                || path.indexOf('/webhdfs/v1/user/' + username + '/') === 0);
        } // if else
    } // if else if
} // isAuthorized

http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    var reqUser = url.parse(req.url, true).query['user.name'];
    var token = req.headers['x-auth-token'];
    var cacheCode = cache.isCacheAuthenticated(reqUser, token);

    logger.info(reqUser + ' is trying to access to ' + path + ' with the token ' + token);

    if (cacheCode == 1) {
        if (isAuthorized(reqUser, path)) {
            logger.info('Authorization OK: user ' + reqUser + ' is allowed to access ' + path);
            logger.info('Redirecting to http://' + conf.target.host + ':' + conf.target.port);
            proxy.web(req, res, {target: 'http://' + conf.target.host + ':' + conf.target.port});
        } else {
            logger.error('Authorization error: user ' + reqUser + ' is not allowed to access ' + path);
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end('Authorization error: user ' + reqUser + ' cannot access ' + path);
        } // if else
    } else {
        idm.authenticate(token, function (error, result) {
            if (error) {
                logger.error('Authentication error: ' + error);
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end('Authentication error: ' + error);
            } else {
                var json = JSON.parse(result);

                if (json['error']) {
                    // Changing the message due to idm returns a 'Unauthorized' in a authentication check
                    var jsonString = JSON.stringify(result);
                    var newResult = JSON.parse(jsonString.replace('Unauthorized', 'Not authenticated'));
                    logger.error('Authentication error: ' + newResult);
                    res.writeHead(400, {'Content-Type': 'text/plain'});
                    res.end('Authentication error: ' + newResult);
                } else {
                    var idmUser = json['id'];

                    if (idmUser !== reqUser) {
                        var errorMsg = JSON.stringify('{\"error\": {\"message\": \"User doesn\'t match the provided ' +
                            'token\",\"code\": 404, \"title\": \"Not authenticated\"}}');
                        logger.error('Authentication error: ' + JSON.parse(errorMsg));
                        res.writeHead(400, {'Content-Type': 'text/plain'});
                        res.end('Authentication error: ' + JSON.parse(errorMsg));
                    } else {
                        logger.info('Authentication OK: ' + result);
                        if (cacheCode == 0) {
                            var newValue = {"user": idmUser, "token": token};
                            cache.pushNewEntry(newValue);
                        } else if (cacheCode == 2) {
                            cache.updateEntry(idmUser, token);
                        } else {
                            // Unreachable statement
                        } // if else if

                        if (isAuthorized(idmUser, path)) {
                            logger.info('Authorization OK: user ' + idmUser + ' is allowed to access ' + path);
                            logger.info('Redirecting to http://' + conf.target.host + ':' + conf.target.port);
                            proxy.web(req, res, {target: 'http://' + conf.target.host + ':' + conf.target.port});
                        } else {
                            logger.error('Authorization error: user ' + idmUser + ' is not allowed to access ' + path);
                            res.writeHead(400, {'Content-Type': 'text/plain'});
                            res.end('Authorization error: user ' + idmUser + ' cannot access ' + path);
                        } // if else
                    } // if else
                } // if else
            } // if else
        });
    } // if else if
}).listen(conf.port);
