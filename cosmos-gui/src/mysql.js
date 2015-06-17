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
 * MySQL driver.
 *
 * Author: frb
 */

// module dependencies
var mysql = require('mysql');
var config = require('../conf/cosmos-gui.json');

module.exports = {
    createConnection: function() {
        return mysql.createConnection({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            database: config.database
        });
    }, // createConnection

    connect: function(connection) {
        connection.connect(function (error) {
            if (error) {
                throw error;
            } else {
                console.log('Conexion correcta.');
            }
        });
    }, // connect

    exists: function(connection, username, password) {
        var query = connection.query(
            'SELECT count(*) FROM user where fiware_username=? and fiware_password=?',
            [username, password],
            function (error, result) {
                if (error) {
                    throw error;
                } else {
                    if (result.length > 0) {
                        console.log("Cosmos user already stored in the database");
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        );
    }, // exists

    add: function(connection, username, password) {
    },

    close: function(connection) {
        connection.end();
    } // end
}
