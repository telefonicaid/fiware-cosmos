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
 * Command runner.
 *
 * Author: frb
 */

// Module dependencies
var spawn = require('child_process').spawn;
var fs = require('fs');

function runHadoopJar(userId, jarName, jarInHDFS, className, libJarsName, libJarsInHDFS, input, output, otherArgs, callback) {
    // Copy the jar from the HDFS user space
    var params = ['-u', userId, 'hadoop', 'fs', '-copyToLocal', jarInHDFS, '/home/' + userId + '/' + jarName];
    var command = spawn('sudo', params);

    command.on('close', function(code) {
        // Copy the libjar from the HDFS user space
        var params = ['-u', userId, 'hadoop', 'fs', '-copyToLocal', libJarsInHDFS, '/home/' + userId + '/' + libJarsName];
        var command = spawn('sudo', params);

        command.on('close', function(code) {
            // Run the MR job
            var params = [];

            if(args.length === 0) {
                params = ['-u', userId, 'hadoop', 'jar', '/home/' + userId + '/' + jarName, className];
            } else {
                par = ['-u', userId, 'hadoop', 'jar', '/home/' + userId + '/' + jarName, className];
                params = par.concat(args.split(' '));
            } // else

            logger.info('sudo ' + params.toString().replace(',', ' '));
            var command = spawn('sudo', params);
            var jobId = null;
            var stderrTraces = '';
            var stdoutTraces = '';
            var stderrFile = '';
            var stdoutFile = '';

            // This function catches the stderr as it is being produced (console logs are printed in the stderr). At the
            // moment of receiving the line containing the job ID, get it and return with no error (no error means the
            // job could be run, independently of the final result of the job)
            command.stderr.on('data', function (data) {
                var dataStr = data.toString();
                stderrTraces += dataStr;
                var magicString = 'Submitting tokens for job: ';
                var indexOfJobId = dataStr.indexOf(magicString);

                if(indexOfJobId >= 0) {
                    jobId = dataStr.substring(indexOfJobId + magicString.length, indexOfJobId + magicString.length + 22);
                    var params = ['-u', userId, 'rm', '/home/' + userId + '/' + jarName];
                    var command = spawn('sudo', params);
                    var params = ['-u', userId, 'rm', '/home/' + userId + '/' + libJarsName];
                    var command = spawn('sudo', params);
                    stderrFile = './' + jobId + '.stderr';
                    fs.closeSync(fs.openSync(stderrFile, 'w'));
                    stdoutFile = './' + jobId + '.stdout';
                    fs.closeSync(fs.openSync(stdoutFile, 'w'));
                    return callback(null, jobId);
                } // if

                if (jobId !== null) {
                    fs.writeFileSync(stderrFile, JSON.stringify(stderrTraces));
                } // if
            });

            command.stdout.on('data', function (data) {
                var dataStr = data.toString();
                stdoutTraces += dataStr;

                if (jobId !== null) {
                    fs.writeFileSync(stdoutFile, JSON.stringify(stdoutTraces));
                } // if
            });

            // This function catches the moment the command finishes. Return the error code if the job ID was never got
            command.on('close', function (code) {
                if (jobId === null) {
                    return callback('{"stderr":' + JSON.stringify(stderrTraces)
                        + ',"stdout":' + JSON.stringify(stdoutTraces) + '}', null);
                } // if
            });
        });
    });
} // runHadoopJar

function runHadoopJobList(userId, callback) {
    var params = ['job', '-list', 'all'];
    var command = spawn('hadoop', params);
    var jobInfos = '[';
    var firstJobInfo = true;

    command.stdout.on('data', function (data) {
        var dataStr = data.toString();
        var lines = dataStr.split("\n");

        for (i in lines) {
            if(i > 1) {
                var fields = lines[i].split("\t");

                if (fields.length > 3 && fields[3].replace(/ /g,'') === userId) {
                    var jobInfo = '{';
                    var jobId = null;

                    for (j in fields) {
                        if (fields[j].length > 0) {
                            var value = fields[j].replace(/ /g,'');

                            if (j == 0) {
                                jobInfo += '"job_id":"' + value + '"';
                                jobId = value;
                            } else if (j == 1) {
                                jobInfo += ',"state":"' + value + '"';
                            } else if (j == 2) {
                                jobInfo += ',"start_time":"' + value + '"';
                            } else if (j == 3) {
                                jobInfo += ',"user_id":"' + value + '"';
                            } // if else
                        } // if
                    } // for

                    if (verbose === 'true' && jobId !== null) {
                        var stderrFile = './' + jobId + '.stderr';

                        try {
                            fs.statSync(stderrFile);
                            var stderrTraces = fs.readFileSync(stderrFile);

                            if (stderrTraces.length === 0) {
                                stderrTraces = '""';
                            } // if

                            jobInfo += ',"stderr":' + stderrTraces;
                        } catch (ex) {
                            jobInfo += ',"stderr":""';
                        } // if else

                        var stdoutFile = './' + jobId + '.stdout';

                        try {
                            fs.statSync(stdoutFile);
                            var stdoutTraces = fs.readFileSync(stdoutFile);

                            if (stdoutTraces.length === 0) {
                                stdoutTraces = '""';
                            } // if

                            jobInfo += ',"stdout":' + stdoutTraces;
                        } catch (ex) {
                            jobInfo += ',"stdout":""';
                        } // if else
                    } // if

                    jobInfo += '}';

                    if (firstJobInfo) {
                        jobInfos += jobInfo;
                        firstJobInfo = false;
                    } else {
                        jobInfos += ',' + jobInfo;
                    } // if else
                } // if
            } // if
        } // for
    });

    // This function catches the moment the command finishes. Return the error code if the jobs information was never
    // got
    command.on('close', function (code) {
        jobInfos += ']';
        return callback(null, jobInfos);
    });
} // runHadoopJobList

function runHadoopJobKill(jobId, callback) {
    var params = ['job', '-kill', jobId];
    var command = spawn('hadoop', params);

    command.stderr.on('data', function (data) {
        var dataStr = data.toString();
        var magicString = 'Application with id';

        if(dataStr.indexOf(magicString) >= 0) {
            return callback('Application does not exist');
        } // if
    });

    command.stdout.on('data', function (data) {
        var dataStr = data.toString();
        var magicString = 'Killed job';

        if (dataStr.indexOf(magicString) >= 0) {
            return callback(null);
        } // if
    });
} // runHadoopJobKill

module.exports = {
    runHadoopJar: runHadoopJar,
    runHadoopJobList: runHadoopJobList,
    runHadoopJobKill: runHadoopJobKill
} // module.exports
