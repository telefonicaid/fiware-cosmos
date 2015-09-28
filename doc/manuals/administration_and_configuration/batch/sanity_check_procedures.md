Sanity check procedures
-----------------------

### End to end testing

#### HAAS engine (Sahara-based)

`   $ curl -X GET "`[`http://localhost:5000`](http://localhost:5000)`"`\
`   {"versions": {"values": [{"status": "stable", "updated": "2015-03-30T00:00:00Z", "media-types": [{"base": "application/json", "type": "application/vnd.openstack.identity-v3+json"}], "id": "v3.4", "links": [{"href": "`[`http://localhost:5000/v3/`](http://localhost:5000/v3/)`", "rel": "self"}]}, {"status": "stable", "updated": "2014-04-17T00:00:00Z", "media-types": [{"base": "application/json", "type": "application/vnd.openstack.identity-v2.0+json"}], "id": "v2.0", "links": [{"href": "`[`http://localhost:5000/v2.0/`](http://localhost:5000/v2.0/)`", "rel": "self"}, {"href": "`[`http://docs.openstack.org/`](http://docs.openstack.org/)`", "type": "text/html", "rel": "describedby"}]}]}}`

`   $ curl -X GET "`[`http://localhost:5000/v3`](http://localhost:5000/v3)`"`\
`   {"version": {"status": "stable", "updated": "2015-03-30T00:00:00Z", "media-types": [{"base": "application/json", "type": "application/vnd.openstack.identity-v3+json"}], "id": "v3.4", "links": [{"href": "`[`http://localhost:5000/v3/`](http://localhost:5000/v3/)`", "rel": "self"}]}}`\
`  `

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

#### HAAS engine (shared Hadoop-based)

The computing services to be tested are those exposed by the services
node.

Regarding ssh, you must be able to connect to the services node as the
sudoer user you created by using its private key.

`   $ ssh -i /path/to/the/`<private_key>` `<sudoer_user>`@`<services_host>\
`   Last login: Sun Jul 26 12:23:58 2015 from mac-510380.local.hi.inet`\
`   [services_host ~]$ `

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

#### Storage cluster

The storage services to be tested are those exposed by the services
node.

HttpFS must be able to list the content of the HDFS root directory
(simple authentication as `hdfs` user):

`   $ curl -X GET "`[`http://`](http://)<services_host>`:14000/webhdfs/v1/user?op=liststatus&user.name=hdfs" | python -m json.tool`\
`   {`\
`       "FileStatuses": {`\
`           "FileStatus": [`\
`               {`\
`                   "accessTime": 0,`\
`                   "blockSize": 0,`\
`                   "group": "hdfs",`\
`                   "length": 0,`\
`                   "modificationTime": 1430907735128,`\
`                   "owner": "ambari-qa",`\
`                   "pathSuffix": "ambari-qa",`\
`                   "permission": "770",`\
`                   "replication": 0,`\
`                   "type": "DIRECTORY"`\
`               },`\
`               ...`\
`           ]`\
`       }`\
`   }`

`python -m json.tool` is used just to pretty printing the JSON output of
the request.

If you decided to protect the HttpFS REST API with OAuth2, you will have
to ask for a valid token and attach it to the above request:

`   $ curl -k -X POST "`[`https://`](https://)<tokens_generator_host>`:13000/cosmos-auth/v1/token" -H "Content-Type: application/x-www-form-urlencoded" -d "grant_type=password&username=xxxxxxxx&password=xxxxxxxx"`\
`   {`\
`       "access_token": "qjHPUcnW6leYAqr3Xw34DWLQlja0Ix",`\
`       "token_type": "Bearer",`\
`       "expires_in": 3600,`\
`       "refresh_token": "V2Wlk7aFCnElKlW9BOmRzGhBtqgR2z"`\
`   }`\
`   $ curl -X GET "`[`http://`](http://)<services_host>`:14000/webhdfs/v1/user?op=liststatus&user.name=hdfs" -H "X-Auth-Token: qjHPUcnW6leYAqr3Xw34DWLQlja0Ix" | python -m json.tool`\
`   {`\
`       "FileStatuses": {`\
`           "FileStatus": [`\
`               ...`\
`           ]`\
`       }`\
`   }`

Regarding ssh, you must be able to connect to the services node as the
sudoer user you created by using its private key.

`   $ ssh -i /path/to/the/`<private_key>` `<sudoer_user>`@`<services_host>\
`   Last login: Sun Jul 26 12:23:58 2015 from mac-510380.local.hi.inet`\
`   [services_host ~]$ `

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

#### Cosmos GUI

The most obvious way of testing the GUI is running is using it. Try
connecting with your browser to the GUI (default port TCP/80, unless you
have configured another one) and try to register a new user. You should
browse the pages documented in the
[usage](http://github.com/telefonicaid/fiware-cosmos/blob/develop/cosmos-gui/README.md#usage)
section of the README at Github.

Anyway, using `telnet` is a valid method as well:

`   $ telnet `<host_running_the_gui>` 80`\
`   Trying `<host_running_the_gui>`...`\
`   Connected to `<host_running_the_gui>`.`\
`   Escape character is '^]'.`\
`   ^CConnection closed by foreign host.`

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

#### Tidoop

Both the Hadoop extension (tidoop-hadoop-ext) and the MapReduce library
(tidoop-mr-lib) are not services that can be tested from an e2e point of
view.

Nevertheless, the REST API for the MapReduce library should answer to a
version request:

`   $ curl -X GET "`[`http://`](http://)<host_running_the_api>`:12000/version"`\
`   {version: 0.1.0}`

Anyway, using `telnet` is a valid method as well:

`   $ telnet `<host_running_the_api>` 12000`\
`   Trying `<host_running_the_api>`...`\
`   Connected to `<host_running_the_api>`.`\
`   Escape character is '^]'.`\
`   ^CConnection closed by foreign host.`

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

#### Cygnus

Cygnus listens for incoming NGSI-like notifications in all the
configured Http sources. Assuming a single source is configured for
listening at TCP/5050 port, you can test it is working by invoking any
of the scripts under `resources/ngsi-examples` emulating NGSI
notifications:

`   $ resources/ngsi-examples/notification-json-simple.xml `[`http://`](http://)<host_running_cygnus>`:5050/notify`\
`   * Hostname was NOT found in DNS cache`\
`   *   Trying ::1...`\
`   * Connected to `<host_running_cygnus>` (::1) port 5050 (#0)`\
`   > POST /notify HTTP/1.1`\
`   > Host: `<host_running_cygnus>`:5050`\
`   > Content-Type: application/json`\
`   > Accept: application/json`\
`   > User-Agent: orion/0.10.0`\
`   > Fiware-Service: def_serv`\
`   > Fiware-ServicePath: def_serv_path`\
`   > Content-Length: 460`\
`   > `\
`   * upload completely sent off: 460 out of 460 bytes`\
`   `< HTTP/1.1 200 OK
    < Transfer-Encoding: chunked
    * Server Jetty(6.1.26) is not blacklisted
    < Server: Jetty(6.1.26)
    < 
    * Connection #0 to host <host_running_cygnus>` left intact`

Anyway, using `telnet` is a valid method as well:

`   $ telnet `<host_running_cygnus>` 5050`\
`   Trying `<host_running_cygnus>`...`\
`   Connected to `<host_running_cygnus>`.`\
`   Escape character is '^]'.`\
`   ^CConnection closed by foreign host.`

In addition, a REST-like management interface is setup at TCP/8081 port.
Current version of Cygnus returns the version when asked for it:

`   $ curl -X GET "`[`http://`](http://)<host_running_cygnus>`:8081/version"`\
`   {"version":"0.8.2_SNAPSHOT.8a6c07054da894fc37ef30480cb091333e2fccfa"}`

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

### List of running processes

#### HAAS engine (Sahara-based)

Processes run by the Glance service:

`   $ ps -ef | grep glance | grep -v grep`\
`   fiware    9779  9757  0 jun09 pts/7    00:00:00 /usr/bin/python /usr/local/bin/glance-registry --config-file=/etc/glance/glance-registry.conf`\
`   fiware    9808  9779  0 jun09 pts/7    00:00:05 /usr/bin/python /usr/local/bin/glance-registry --config-file=/etc/glance/glance-registry.conf`\
`   fiware    9809  9779  0 jun09 pts/7    00:00:05 /usr/bin/python /usr/local/bin/glance-registry --config-file=/etc/glance/glance-registry.conf`\
`   fiware    9817  9787  0 jun09 pts/8    10:20:41 /usr/bin/python /usr/local/bin/glance-api --config-file=/etc/glance/glance-api.conf`\
`   fiware    9826  9817  0 jun09 pts/8    00:00:05 /usr/bin/python /usr/local/bin/glance-api --config-file=/etc/glance/glance-api.conf`\
`   fiware    9827  9817  0 jun09 pts/8    00:00:05 /usr/bin/python /usr/local/bin/glance-api --config-file=/etc/glance/glance-api.conf`

Processes run by the Nova service:

`   $ ps -ef | grep nova | grep -v grep`\
`   fiware    9965  9940  0 jun09 pts/9    10:11:53 /usr/bin/python /usr/local/bin/nova-api`\
`   fiware    9974  9965  0 jun09 pts/9    00:00:05 /usr/bin/python /usr/local/bin/nova-api`\
`   fiware    9975  9965  0 jun09 pts/9    00:00:05 /usr/bin/python /usr/local/bin/nova-api`\
`   fiware    9978  9965  0 jun09 pts/9    00:25:45 /usr/bin/python /usr/local/bin/nova-api`\
`   fiware    9979  9965  0 jun09 pts/9    00:25:44 /usr/bin/python /usr/local/bin/nova-api`\
`   fiware    9986  9965  0 jun09 pts/9    00:00:05 /usr/bin/python /usr/local/bin/nova-api`\
`   fiware    9987  9965  0 jun09 pts/9    00:00:05 /usr/bin/python /usr/local/bin/nova-api`\
`   fiware   10068 10042  0 jun09 pts/10   10:19:58 /usr/bin/python /usr/local/bin/nova-conductor --config-file /etc/nova/nova.conf`\
`   fiware   10101 10068  0 jun09 pts/10   01:56:40 /usr/bin/python /usr/local/bin/nova-conductor --config-file /etc/nova/nova.conf`\
`   fiware   10102 10068  0 jun09 pts/10   01:56:30 /usr/bin/python /usr/local/bin/nova-conductor --config-file /etc/nova/nova.conf`\
`   fiware   10103 10068  0 jun09 pts/10   01:56:16 /usr/bin/python /usr/local/bin/nova-conductor --config-file /etc/nova/nova.conf`\
`   fiware   10104 10068  0 jun09 pts/10   01:56:33 /usr/bin/python /usr/local/bin/nova-conductor --config-file /etc/nova/nova.conf`\
`   fiware   10119 10081  0 jun09 pts/11   01:05:16 /usr/bin/python /usr/local/bin/nova-cert --config-file /etc/nova/nova.conf`\
`   fiware   10161 10125  0 jun09 pts/12   01:59:40 /usr/bin/python /usr/local/bin/nova-network --config-file /etc/nova/nova.conf`\
`   fiware   10210 10170  0 jun09 pts/13   01:11:32 /usr/bin/python /usr/local/bin/nova-scheduler --config-file /etc/nova/nova.conf`\
`   fiware   10252 10220  0 jun09 pts/14   00:19:12 /usr/bin/python /usr/local/bin/nova-novncproxy --config-file /etc/nova/nova.conf --web /opt/stack/noVNC`\
`   fiware   10292 10265  0 jun09 pts/15   01:04:02 /usr/bin/python /usr/local/bin/nova-consoleauth --config-file /etc/nova/nova.conf`\
`   root     10340 10311  0 jun09 pts/16   00:00:00 sg libvirtd /usr/local/bin/nova-compute --config-file /etc/nova/nova.conf`\
`   fiware   10350 10340  0 jun09 pts/16   03:13:59 /usr/bin/python /usr/local/bin/nova-compute --config-file /etc/nova/nova.conf`

Processes run by the Cinder service:

`   $ ps -ef | grep cinder | grep -v grep`\
`   fiware   10428 10406  0 jun09 pts/17   10:21:39 /usr/bin/python /usr/local/bin/cinder-api --config-file /etc/cinder/cinder.conf`\
`   fiware   10437 10428  0 jun09 pts/17   00:00:05 /usr/bin/python /usr/local/bin/cinder-api --config-file /etc/cinder/cinder.conf`\
`   fiware   10438 10428  0 jun09 pts/17   00:00:05 /usr/bin/python /usr/local/bin/cinder-api --config-file /etc/cinder/cinder.conf`\
`   fiware   10474 10449  0 jun09 pts/18   01:26:59 /usr/bin/python /usr/local/bin/cinder-scheduler --config-file /etc/cinder/cinder.conf`\
`   fiware   10512 10484  0 jun09 pts/19   10:22:40 /usr/bin/python /usr/local/bin/cinder-volume --config-file /etc/cinder/cinder.conf`\
`   fiware   10530 10512  0 jun09 pts/19   01:41:24 /usr/bin/python /usr/local/bin/cinder-volume --config-file /etc/cinder/cinder.conf`

Processes run by the Sahara service:

`   $ ps -ef | grep sahara | grep -v grep`\
`   fiware   10948 10923  0 jun09 pts/20   00:27:53 /usr/bin/python /usr/local/bin/sahara-all --config-file /etc/sahara/sahara.conf`

Other services run:

`   $ ps -ef | grep rabbitmq | grep -v grep`\
`   rabbitmq  1559     1  0 jun09 ?        00:00:28 /usr/lib/erlang/erts-5.10.4/bin/epmd -daemon`\
`   rabbitmq  6868     1  0 jun09 ?        00:00:00 /bin/sh /usr/sbin/rabbitmq-server`\
`   rabbitmq  6877  6868  0 jun09 ?        08:32:56 /usr/lib/erlang/erts-5.10.4/bin/beam.smp -W w -K true -A30 -P 1048576 -- -root /usr/lib/erlang -progname erl -- -home /var/lib/rabbitmq -- -pa /usr/lib/rabbitmq/lib/rabbitmq_server-3.2.4/sbin/../ebin -noshell -noinput -s rabbit boot -sname rabbit@dev-fiwr-ubuntu-01 -boot start_sasl -kernel inet_default_connect_options [{nodelay,true}] -sasl errlog_type error -sasl sasl_error_logger false -rabbit error_logger {file,"/var/log/rabbitmq/rabbit@dev-fiwr-ubuntu-01.log"} -rabbit sasl_error_logger {file,"/var/log/rabbitmq/rabbit@dev-fiwr-ubuntu-01-sasl.log"} -rabbit enabled_plugins_file "/etc/rabbitmq/enabled_plugins" -rabbit plugins_dir "/usr/lib/rabbitmq/lib/rabbitmq_server-3.2.4/sbin/../plugins" -rabbit plugins_expand_dir "/var/lib/rabbitmq/mnesia/rabbit@dev-fiwr-ubuntu-01-plugins-expand" -os_mon start_cpu_sup false -os_mon start_disksup false -os_mon start_memsup false -mnesia dir "/var/lib/rabbitmq/mnesia/rabbit@dev-fiwr-ubuntu-01"`\
`   rabbitmq  7013  6877  0 jun09 ?        00:00:00 inet_gethost 4`\
`   rabbitmq  7014  7013  0 jun09 ?        00:00:00 inet_gethost 4`

`   $ ps -ef | grep apache | grep -v grep`\
`   root      7758  7736  0 jun09 pts/4    00:00:00 sudo tail -f /var/log/apache2/keystone.log`\
`   root      7766  7758  0 jun09 pts/4    00:00:00 tail -f /var/log/apache2/keystone.log`\
`   root      7790  7768  0 jun09 pts/5    00:00:00 sudo tail -f /var/log/apache2/keystone_access.log`\
`   root      7791  7790  0 jun09 pts/5    00:00:00 tail -f /var/log/apache2/keystone_access.log`\
`   www-data  7794  8775  0 jul28 ?        00:00:00 /usr/sbin/apache2 -k start`\
`   www-data  7808  8775  0 jul28 ?        00:00:00 /usr/sbin/apache2 -k start`\
`   www-data  7809  8775  0 jul28 ?        00:00:00 /usr/sbin/apache2 -k start`\
`   root      8775     1  0 jun09 ?        00:01:48 /usr/sbin/apache2 -k start`\
`   root      8952  8926  0 jun09 pts/6    00:00:00 sudo tail -f /var/log/apache2/horizon_error.log`\
`   root      8955  8952  0 jun09 pts/6    00:00:00 tail -f /var/log/apache2/horizon_error.log`

`   $ ps -ef | grep mysqld | grep -v grep`\
`   mysql     7308     1  0 jun09 ?        02:22:53 /usr/sbin/mysqld`

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

#### HAAS engine (shared Hadoop-based)

Use the `jps` command from Java in order to list the Java processes
(yes, Hadoop ones are Java processes). Processes within the Namenode
should be:

`   $ jps`\
`   31622 Jps`\
`   23013 NameNode`\
`   22405 SecondaryNameNode`

Processes within each one of the Datanodes should be:

`   $ jps`\
`   23445 Jps`\
`   10989 DataNode`

Please observe `jps` is not distributed with OpenJDK. In that case, you
will have to use the `ps` command, e.g.:

`   $ ps -ef | grep NameNode | grep -v grep`\
`   hdfs     23013     1  0 Jul22 ?        00:28:36 /usr/java/jdk1.7.0_71//bin/java -Dproc_namenode -Xmx1024m -Djava.net.preferIPv4Stack=true -Djava.net.preferIPv4Stack=true -Djava.net.preferIPv4Stack=true -Dhadoop.log.dir=/var/log/hadoop/hdfs -Dhadoop.log.file=hadoop.log -Dhadoop.home.dir=/usr/lib/hadoop -Dhadoop.id.str=hdfs -Dhadoop.root.logger=INFO,console -Djava.library.path=:/usr/lib/hadoop/lib/native/Linux-amd64-64:/usr/lib/hadoop/lib/native -Dhadoop.policy.file=hadoop-policy.xml -Djava.net.preferIPv4Stack=true -Dhadoop.log.dir=/var/log/hadoop/hdfs -Dhadoop.log.file=hadoop-hdfs-namenode-dev-fiwr-bignode-01.log -Dhadoop.home.dir=/usr/lib/hadoop -Dhadoop.id.str=hdfs -Dhadoop.root.logger=INFO,RFA -Djava.library.path=:/usr/lib/hadoop/lib/native/Linux-amd64-64:/usr/lib/hadoop/lib/native:/usr/lib/hadoop/lib/native/Linux-amd64-64:/usr/lib/hadoop/lib/native/Linux-amd64-64:/usr/lib/hadoop/lib/native -Dhadoop.policy.file=hadoop-policy.xml -Djava.net.preferIPv4Stack=true -server -XX:ParallelGCThreads=8 -XX:+UseConcMarkSweepGC -XX:ErrorFile=/var/log/hadoop/hdfs/hs_err_pid%p.log -XX:NewSize=200m -XX:MaxNewSize=200m -Xloggc:/var/log/hadoop/hdfs/gc.log-201507221050 -verbose:gc -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+PrintGCDateStamps -Xms1024m -Xmx1024m -Dhadoop.security.logger=INFO,DRFAS -Dhdfs.audit.logger=INFO,DRFAAUDIT -server -XX:ParallelGCThreads=8 -XX:+UseConcMarkSweepGC -XX:ErrorFile=/var/log/hadoop/hdfs/hs_err_pid%p.log -XX:NewSize=200m -XX:MaxNewSize=200m -Xloggc:/var/log/hadoop/hdfs/gc.log-201507221050 -verbose:gc -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+PrintGCDateStamps -Xms1024m -Xmx1024m -Dhadoop.security.logger=INFO,DRFAS -Dhdfs.audit.logger=INFO,DRFAAUDIT -server -XX:ParallelGCThreads=8 -XX:+UseConcMarkSweepGC -XX:ErrorFile=/var/log/hadoop/hdfs/hs_err_pid%p.log -XX:NewSize=200m -XX:MaxNewSize=200m -Xloggc:/var/log/hadoop/hdfs/gc.log-201507221050 -verbose:gc -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+PrintGCDateStamps -Xms1024m -Xmx1024m -Dhadoop.security.logger=INFO,DRFAS -Dhdfs.audit.logger=INFO,DRFAAUDIT -Dhadoop.security.logger=INFO,RFAS org.apache.hadoop.hdfs.server.namenode.NameNode `

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

#### Storage cluster

Use `jps` command from Java in order to list the Java processes (yes,
Hadoop ones are Java processes). Processes within the Namenode should
be:

`   $ jps`\
`   31622 Jps`\
`   23013 NameNode`\
`   22405 SecondaryNameNode`

Processes within each one of the Datanodes should be:

`   $ jps`\
`   23445 Jps`\
`   10989 DataNode`

Please observe `jps` is not distributed with OpenJDK. In that case, you
will have to use the `ps` command, e.g.:

`   $ ps -ef | grep NameNode | grep -v grep`\
`   hdfs     23013     1  0 Jul22 ?        00:28:36 /usr/java/jdk1.7.0_71//bin/java -Dproc_namenode -Xmx1024m -Djava.net.preferIPv4Stack=true -Djava.net.preferIPv4Stack=true -Djava.net.preferIPv4Stack=true -Dhadoop.log.dir=/var/log/hadoop/hdfs -Dhadoop.log.file=hadoop.log -Dhadoop.home.dir=/usr/lib/hadoop -Dhadoop.id.str=hdfs -Dhadoop.root.logger=INFO,console -Djava.library.path=:/usr/lib/hadoop/lib/native/Linux-amd64-64:/usr/lib/hadoop/lib/native -Dhadoop.policy.file=hadoop-policy.xml -Djava.net.preferIPv4Stack=true -Dhadoop.log.dir=/var/log/hadoop/hdfs -Dhadoop.log.file=hadoop-hdfs-namenode-dev-fiwr-bignode-01.log -Dhadoop.home.dir=/usr/lib/hadoop -Dhadoop.id.str=hdfs -Dhadoop.root.logger=INFO,RFA -Djava.library.path=:/usr/lib/hadoop/lib/native/Linux-amd64-64:/usr/lib/hadoop/lib/native:/usr/lib/hadoop/lib/native/Linux-amd64-64:/usr/lib/hadoop/lib/native/Linux-amd64-64:/usr/lib/hadoop/lib/native -Dhadoop.policy.file=hadoop-policy.xml -Djava.net.preferIPv4Stack=true -server -XX:ParallelGCThreads=8 -XX:+UseConcMarkSweepGC -XX:ErrorFile=/var/log/hadoop/hdfs/hs_err_pid%p.log -XX:NewSize=200m -XX:MaxNewSize=200m -Xloggc:/var/log/hadoop/hdfs/gc.log-201507221050 -verbose:gc -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+PrintGCDateStamps -Xms1024m -Xmx1024m -Dhadoop.security.logger=INFO,DRFAS -Dhdfs.audit.logger=INFO,DRFAAUDIT -server -XX:ParallelGCThreads=8 -XX:+UseConcMarkSweepGC -XX:ErrorFile=/var/log/hadoop/hdfs/hs_err_pid%p.log -XX:NewSize=200m -XX:MaxNewSize=200m -Xloggc:/var/log/hadoop/hdfs/gc.log-201507221050 -verbose:gc -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+PrintGCDateStamps -Xms1024m -Xmx1024m -Dhadoop.security.logger=INFO,DRFAS -Dhdfs.audit.logger=INFO,DRFAAUDIT -server -XX:ParallelGCThreads=8 -XX:+UseConcMarkSweepGC -XX:ErrorFile=/var/log/hadoop/hdfs/hs_err_pid%p.log -XX:NewSize=200m -XX:MaxNewSize=200m -Xloggc:/var/log/hadoop/hdfs/gc.log-201507221050 -verbose:gc -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+PrintGCDateStamps -Xms1024m -Xmx1024m -Dhadoop.security.logger=INFO,DRFAS -Dhdfs.audit.logger=INFO,DRFAAUDIT -Dhadoop.security.logger=INFO,RFAS org.apache.hadoop.hdfs.server.namenode.NameNode `

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

#### Cosmos GUI

Cosmos GUI runs a single Node.js process:

`   $ ps -ef | grep node | grep -v grep`\
`     503 12773 12770   0  3:21PM ttys000    0:00.46 node ./src/app.js`

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

#### Tidoop

Both the Hadoop extension (tidoop-hadoop-ext) and the MapReduce library
(tidoop-mr-lib) are not services that can be tested from the number of
processes point of view.

Nevertheless, the REST API for the MapReduce library runs the following
Node.js process:

`   $ ps -ef | grep node | grep -v grep`\
`     503 12827 12824   0  3:26PM ttys000    0:00.47 node ./src/server.js`

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

#### Cygnus

Cygnus runs a single Java process:

`   $ ps -ef | grep cygnus | grep -v grep`\
`     503  9760   687   0  9:33AM ttys003    0:03.17 /usr/bin/java -Xmx20m -Dflume.root.logger=INFO,console -cp /Users/frb/devel/fiware/fiware-cygnus/conf:/Applications/apache-flume-1.4.0-bin/lib/*:/Applications/apache-flume-1.4.0-bin/plugins.d/cygnus/lib/*:/Applications/apache-flume-1.4.0-bin/plugins.d/cygnus/libext/* -Djava.library.path= com.telefonica.iot.cygnus.nodes.CygnusApplication -f conf/agent.conf -n cygnusagent`

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

### Network interfaces up and open

#### HAAS engine (Sahara-based)

Opened port by the Nova service:

`   # Standard Openstack API`\
`   $ netstat -na | grep -v grep | grep 8774`\
`   tcp        0      0 0.0.0.0:8774            0.0.0.0:*               LISTEN  `\
`   # Metadata port`\
`   $ netstat -na | grep -v grep | grep 8775`\
`   tcp        0      0 0.0.0.0:8775            0.0.0.0:*               LISTEN     `\
`   # API for EC2`\
`   $ netstat -na | grep -v grep | grep 8773`\
`   tcp        0      0 0.0.0.0:8773            0.0.0.0:*               LISTEN  `\
`   # Not-VNC proxy`\
`   $ netstat -na | grep -v grep | grep 6080`\
`   tcp        0      0 0.0.0.0:6080            0.0.0.0:*               LISTEN`

Opened ports by the Cinder service:

`   $ netstat -na | grep -v grep | grep 8776`\
`   tcp        0      0 0.0.0.0:8776            0.0.0.0:*               LISTEN`

Opened ports by the Glance service:

`   # Registry`\
`   $ netstat -na | grep -v grep | grep 9191`\
`   tcp        0      0 0.0.0.0:9191            0.0.0.0:*               LISTEN `\
`   # API`\
`   $ netstat -na | grep -v grep | grep 9292`\
`   tcp        0      0 0.0.0.0:9292            0.0.0.0:*               LISTEN `

Opened ports by the Horizon service:

`   # Public port`\
`   $ netstat -na | grep -v grep | grep 5000`\
`   tcp6       0      0 :::5000                 :::*                    LISTEN   `\
`   # Admin port  `\
`   $ netstat -na | grep -v grep | grep 35357`\
`   tcp6       0      0 :::35357                :::*                    LISTEN    `

Other ports opened by other common services:

`   $ netstat -na | grep -v grep |grep LISTEN |grep 3306 `\
`   tcp        0      0 0.0.0.0:3306            0.0.0.0:*               LISTEN     `\
`   $ netstat -na | grep -v grep |grep LISTEN |grep 80      `\
`   tcp6       0      0 :::80                   :::*                    LISTEN     `\
`   $ netstat -na | grep -v grep |grep LISTEN |grep 5672`\
`   tcp6       0      0 :::5672                 :::*                    LISTEN     `

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

#### HAAS engine (shared Hadoop-based)

Opened ports by the HDFS service:

`   # NameNode (IPC)`\
`   $ netstat -an | grep 8020 | grep -v grep`\
`   tcp        0      0 10.95.236.70:8020           0.0.0.0:*                   LISTEN      `

`   # NameNode (http version)`\
`   $ netstat -an | grep 50070 | grep -v grep`\
`   tcp        0      0 10.95.236.70:50070          0.0.0.0:*                   LISTEN      `

`   # SecondaryNamenode`\
`   $ netstat -an | grep 50090 | grep -v grep`\
`   tcp        0      0 10.95.236.44:50090          0.0.0.0:*                   LISTEN   `

`   # Datanodes (IPC)`\
`   $ netstat -na | grep 8010 | grep -v grep`\
`   tcp        0      0 0.0.0.0:8010                0.0.0.0:*                   LISTEN`

`   # Datanodes (IPC for data transfer)`\
`   $ netstat -na | grep 50010 | grep -v grep`\
`   tcp        0      0 0.0.0.0:50010               0.0.0.0:*                   LISTEN`

`   # Datanodes (http)`\
`   $ netstat -na | grep 50075 | grep -v grep`\
`   tcp        0      0 0.0.0.0:50075               0.0.0.0:*                   LISTEN `

Opened ports by the YARN service:

`   # ResourceManager`\
`   $ netstat -na | grep 8050`\
`   tcp        0      0 ::ffff:10.95.236.44:8050    :::*                        LISTEN`

`   # ResourceManager (http version)`\
`   $ netstat -na | grep 8088`\
`   tcp        0      0 ::ffff:10.95.236.44:8088    :::*                        LISTEN`

`   # ResourceManager (admin)`\
`   $ netstat -na | grep 8141`\
`   tcp        0      0 ::ffff:10.95.236.44:8141    :::*                        LISTEN  `

`   # Scheduler`\
`   $ netstat -na | grep 8030`\
`   tcp        0      0 ::ffff:10.95.236.44:8030    :::*                        LISTEN`

`   # Timeline`\
`   $ netstat -na | grep 10200`\
`   tcp        0      0 ::ffff:10.95.236.44:10200   :::*                        LISTEN `

`   # Timeline (http version)`\
`   $ netstat -na | grep 8188`\
`   tcp        0      0 ::ffff:10.95.236.44:8188    :::*                        LISTEN  `

`   # TimeLine (https version)`\
`   $ netstat -na | grep 8190`\
`   tcp        0      0 ::ffff:10.95.236.44:8190    :::*                        LISTEN `

`   # ResourceTracker:`\
`   $ netstat -na | grep 8025`\
`   tcp        0      0 ::ffff:10.95.236.44:8025    :::*                        LISTEN  `

Opened ports by the MapReduce2 service:

`   # JobHistory`\
`   $ netstat -na | grep 10020 | grep -v grep`\
`   tcp        0      0 10.95.236.44:10020          0.0.0.0:*                   LISTEN      `

`   # JobHistory (http version)`\
`   $ netstat -na | grep 19888 | grep -v grep`\
`   tcp        0      0 10.95.236.44:19888          0.0.0.0:*                   LISTEN    `

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

#### Storage cluster

Opened ports by the HDFS service:

`   # NameNode (IPC)`\
`   $ netstat -an | grep 8020 | grep -v grep`\
`   tcp        0      0 10.95.236.64:8020           0.0.0.0:*                   LISTEN      `

`   # NameNode (http version)`\
`   $ netstat -an | grep 50070 | grep -v grep`\
`   tcp        0      0 10.95.236.64:50070          0.0.0.0:*                   LISTEN      `

`   # SecondaryNamenode`\
`   $ netstat -an | grep 50090 | grep -v grep`\
`   tcp        0      0 10.95.236.44:50090          0.0.0.0:*                   LISTEN   `

`   # Datanodes (IPC)`\
`   $ netstat -na | grep 8010 | grep -v grep`\
`   tcp        0      0 0.0.0.0:8010                0.0.0.0:*                   LISTEN`

`   # Datanodes (IPC for data transfer)`\
`   $ netstat -na | grep 50010 | grep -v grep`\
`   tcp        0      0 0.0.0.0:50010               0.0.0.0:*                   LISTEN`

`   # Datanodes (http)`\
`   $ netstat -na | grep 50075 | grep -v grep`\
`   tcp        0      0 0.0.0.0:50075               0.0.0.0:*                   LISTEN `

Opened port by the HttpFS process:

`   $ netstat -na | grep 14000 | grep -v grep`\
`   tcp        0      0 :::14000                    :::*                        LISTEN`

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

#### Cosmos GUI

Cosmos GUI opens a single port:

`   $ netstat -na | grep 80 | grep -v grep`\
`   tcp4       0      0  *.80                 *.*                    LISTEN`

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

#### Tidoop

Both the Hadoop extension (tidoop-hadoop-ext) and the MapReduce library
(tidoop-mr-lib) are not services that can be tested from the open
interfaces and ports point of view.

Nevertheless, the REST API for the MapReduce library opens the following
port:

`   $ netstat -na | grep 12000 | grep -v grep`\
`   tcp4       0      0  *.12000        *.*                    LISTEN `

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

#### Cygnus

Cygnus opens a single port:

`   $ netstat -na | grep 5050 | grep -v grep`\
`   tcp4       0      0  *.5050                 *.*                    LISTEN`

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

### Databases

#### HAAS engine (Sahara-based)

N/A

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

#### HAAS engine (shared Hadoop-based)

N/A

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

#### Storage cluster

N/A

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

#### Cosmos GUI

The GUI works with a MySQL database named `cosmos` (shared with Tidoop),
tracking registered users in a table named `cosmos_user`. Both database
and table must have been provisioned while installing the REST API.
Check for their existence this way:

`   $ mysql -u cb -p`\
`   Enter password: `\
`   Welcome to the MySQL monitor.  Commands end with ; or \g.`\
`   ...`\
`   Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.`\
`   `\
`   mysql> show databases;`\
`   +-----------------------+`\
`   | Database              |`\
`   +-----------------------+`\
`   | information_schema    |`\
`   | cosmos                |`\
`   | mysql                 |`\
`   | test                  |`\
`   +-----------------------+`\
`   4 rows in set (0.00 sec)`\
`   `\
`   mysql> use cosmos;`\
`   Reading table information for completion of table and column names`\
`   You can turn off this feature to get a quicker startup with -A`\
`   `\
`   Database changed`\
`   mysql> show tables;`\
`   +----------------------+`\
`   | Tables_in_cosmos     |`\
`   +----------------------+`\
`   | tidoop_job           |`\
`   | cosmos_user          |`\
`   +----------------------+`\
`   2 rows in set (0.00 sec)`\
`   `\
`   mysql> select * from cosmos_user;`\
`   0 rows in set (0.00 sec) `

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

#### Tidoop

Both the Hadoop extension (tidoop-hadoop-ext) and the MapReduce library
(tidoop-mr-lib) are not services, thus they don't have any interaction
with databases.

Nevertheless, the REST API for the MapReduce library works with a MySQL
database named `cosmos` (shared with Cosmos GUI), tracking MapReduce
jobs in a table named `tidoop_job`. Both database and table must have
been provisioned while installing the REST API. Check for their
existence this way:

`   $ mysql -u cb -p`\
`   Enter password: `\
`   Welcome to the MySQL monitor.  Commands end with ; or \g.`\
`   ...`\
`   Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.`\
`   `\
`   mysql> show databases;`\
`   +-----------------------+`\
`   | Database              |`\
`   +-----------------------+`\
`   | information_schema    |`\
`   | cosmos                |`\
`   | mysql                 |`\
`   | test                  |`\
`   +-----------------------+`\
`   4 rows in set (0.00 sec)`\
`   `\
`   mysql> use cosmos;`\
`   Reading table information for completion of table and column names`\
`   You can turn off this feature to get a quicker startup with -A`\
`   `\
`   Database changed`\
`   mysql> show tables;`\
`   +----------------------+`\
`   | Tables_in_cosmos     |`\
`   +----------------------+`\
`   | tidoop_job           |`\
`   | cosmos_user          |`\
`   +----------------------+`\
`   2 rows in set (0.00 sec)`\
`   `\
`   mysql> select * from tidoop_job;`\
`   0 rows in set (0.00 sec) `

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

#### Cygnus

N/A

[Top](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/BigData_Analysis_-_Installation_and_Administration_Guide)

