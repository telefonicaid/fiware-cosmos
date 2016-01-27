#<a name="top"></a>FIWARE Lab deployment of Cosmos
Content:

* [Introduction](#section1)
* [Architecture](#section2)
* [Storage cluster](#section3)
    * [Characteristics](#section3.1)
    * [Services node details](#section3.2)
        * [Some tools version](#section3.2.1)
        * [Opened ports summary](#section3.2.2)
        * [HttpFS gateway](#section3.2.3)
            * [FIWARE PEP Proxy (Wilma)](#section3.2.3.1)
        * [Hadoop Inter-Process Communication forward](#section3.2.4)
* [Computing cluster](#section4)
    * [Characteristics](#section4.1)
    * [Services node details](#section4.2)
        * [Some tools version](#section4.2.1)
        * [Opened ports summary](#section4.2.2)
        * [Oozie](#section4.2.3)
        * [Tidoop](#section4.3.4)
        * [Cosmos Authentication server (cosmos-auth)](#section4.2.5)
        * [Hive](#section4.2.6)
            * [HiveServer2 forward](#section4.2.6.1)
            * [Hive configuration for OAuth2 provider](#section4.2.6.2)
            * [OAuth2 provider installation](#section4.2.6.3)
* [GUI](#section5)
* [Reporting issues and contact information](#section6)

##<a name="section1"></a>Introduction
This document describes how Cosmos has been deployed in [FIWARE Lab](https://account.lab.fiware.org/).

As will be see, among all the possibilities regarding the deploymnet of Cosmos the shared Hadoop cluster version has been chosen. In fact, not a single cluster has been deployed but two different clusters have been installed: one exclusively addressed for storage purposes, and another one suited for computing services. A detailed section related to the architecture can be checked next.

For each Hadoop cluster, storage and computing, the main characteristics are given (number of nodes, role of the nodes, storage or computing capabilities) together with a per-node list of characteristics.

Among all the cluster nodes, there is a special node in charge of exposing storage or computing services. Such a node is detailed in a specific section.

[Top](#top)

##<a name="section2"></a>Architecture
To be done.

[Top](#top)

##<a name="section3"></a>Storage cluster
###<a name="section3.1"></a>Characteristics

* Number of nodes: 11
    * Service Nodes: 1
    * Namenodes: 2
    * Datanodes: 8
* Total storage capacity: 52.5 TB (17.5 TB with a replication factor of 3)
* HDFS version: 2.4.0.2.1

|Private FQDN|Public IP and FQDN|Role|HDD (1)|RAM (2)|Installed software|
|---|---|---|---|---|---|
|dev-fiwr-svc-01.hi.inet|195.235.93.174/24, storage.cosmos.lab.fiware.org|Services node|2 TB + 2 TB|32 GB|Wilma, HttpFS|
|dev-fiwr-bignode-01.hi.inet|N.A.|Active Namenode|2 TB + 2 TB|32 GB|HDFS|
|dev-fiwr-bignode-02.hi.inet|N.A.|Standby Namenode|500 GB|32 GB|HDFS|
|dev-fiwr-bignode-03.hi.inet|N.A.|Datanode|3 TB + 1 TB + 1 TB + 1 TB|32 GB|HDFS|
|dev-fiwr-bignode-04.hi.inet|N.A.|Datanode|3 TB + 1 TB + 1 TB + 1 TB|32 GB|HDFS|
|dev-fiwr-bignode-05.hi.inet|N.A.|Datanode|3 TB + 1 TB + 1 TB + 1 TB|32 GB|HDFS|
|dev-fiwr-bignode-06.hi.inet|N.A.|Datanode|3 TB + 1 TB + 1 TB + 1 TB|32 GB|HDFS|
|dev-fiwr-bignode-07.hi.inet|N.A.|Datanode|3 TB + 1 TB + 1 TB + 1 TB|32 GB|HDFS|
|dev-fiwr-bignode-08.hi.inet|N.A.|Datanode|3 TB + 1 TB + 1 TB + 1 TB|32 GB|HDFS|
|dev-fiwr-bignode-09.hi.inet|N.A.|Datanode|3 TB + 1 TB + 1 TB + 1 TB|32 GB|HDFS|
|dev-fiwr-bignode-10.hi.inet|N.A.|Datanode|3 TB + 1 TB + 1 TB + 1 TB|32 GB|HDFS|

(1) `sudo fdisk -l`
(2) `cat /proc/meminfo | grep MemTotal`

[Top](#top)

###<a name="section3.2"></a>Services node details

####<a name="section3.2.1"></a>Some tools version
```
$ node -v
v0.10.41
$ npm -v
1.4.29
$ cc --version | grep cc
cc (GCC) 4.7.2 20121015 (Red Hat 4.7.2-5)
$ g++ -version | grep g++
g++ (GCC) 4.7.2 20121015 (Red Hat 4.7.2-5)
```

[Top](#top)

####<a name="section3.2.2"></a>Opened ports summary
|From|To|Comment|
|---|---|---|
|Internet|storage.cosmos.lab.fiware.org:14000|WebHDFS/HttpFS|
|Internet|storage.cosmos.lab.fiware.org:8020|Hadoop IPC, <i>planned but not actually working</i>|
|TID's intranet|storage.cosmos.lab.fiware.org:22|ssh-based management interface|
|storage.cosmos.lab.fiware.org|account.lab.fiware.org:443|FIWARE Lab's Identity Manager|
|storage.cosmos.lab.fiware.org|cloud.lab.fiware.org:4731|FIWARE Lab's Keystone|

[Top](#top)

####<a name="section3.2.3"></a>HttpFS gateway
It is running on port TCP/41000, user `httpfs`:

```
$ sudo netstat -nap | grep 41000
tcp        0      0 :::41000                    :::*                        LISTEN      9433/java           
$ ps -ef | grep -v grep | grep 9433
httpfs    9433     1  0 Jan11 ?        00:02:07 /usr/bin/java -Djava.util.logging.config.file=/var/lib/hadoop-httpfs/tomcat-deployment/conf/logging.properties -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager -Dhttpfs.home.dir=/usr/lib/hadoop-httpfs -Dhttpfs.config.dir=/etc/hadoop-httpfs/conf -Dhttpfs.log.dir=/var/log/hadoop-httpfs/ -Dhttpfs.temp.dir=/var/run/hadoop-httpfs -Dhttpfs.admin.port=41001 -Dhttpfs.http.port=41000 -Dhttpfs.http.hostname=dev-fiwr-httpfs-01.hi.inet -Dhttpfs.ssl.enabled=false -Dhttpfs.ssl.keystore.file=/var/run/hadoop-httpfs/.keystore -Dhttpfs.ssl.keystore.pass=password -Djava.endorsed.dirs=/usr/lib/bigtop-tomcat/endorsed -classpath /usr/lib/bigtop-tomcat/bin/bootstrap.jar -Dcatalina.base=/var/lib/hadoop-httpfs/tomcat-deployment -Dcatalina.home=/usr/lib/bigtop-tomcat -Djava.io.tmpdir=/var/run/hadoop-httpfs org.apache.catalina.startup.Bootstrap httpfs start
```

Port TCP/41000 is not publicly exposed, but TCP/14000. Wilma PEP proxy is in charge of forwarding from TCP/14000 to TCP41000 (see below).

[Top](#top)

#####<a name="section3.2.3.1"></a>FIWARE PEP Proxy (Wilma)
It is running on port TCP/14000, user `wilma`, for OAuth2-based authentication and authorization about the HttpFS gateway connections (see above).

```
$ sudo netstat -nap | grep 14000
tcp        0      0 0.0.0.0:14000               0.0.0.0:*                   LISTEN      2464/node
$ ps -ef | grep -v grep | grep 2464
wilma     2464     1  0 09:06 pts/0    00:00:00 node server.js
```

This process has been added to `wilma`'s crontab in order to start it on reboot:

```
$ cat /home/wilma/crontab_lines 
@reboot /usr/bin/nohup /usr/local/bin/node /home/wilma/fiware-pep-proxy/server.js > /home/wilma/fiware-pep-proxy/wilma.log &
$ crontab -l
@reboot /usr/bin/nohup /usr/local/bin/node /home/wilma/fiware-pep-proxy/server.js > /home/wilma/fiware-pep-proxy/wilma.log &
```

[Top](#top)

####<a name="section3.2.4"></a>Hadoop Inter-Process Communication forward
<i>NOTE: Planned, not actually working.</i>

Port TCP/8020 for Hadoop Inter-Process Communication (IPC) opened and forwarded to `dev-fiwr-bignode-01.hi.inet:8020` (Active Namenode):

```
$ sudo bash -c "echo 1 > /proc/sys/net/ipv4/ip_forward"
$ sudo iptables -F
$ sudo iptables -t nat -F
$ sudo iptables -X
$ sudo iptables -t nat -A PREROUTING -p tcp --dport 8020 -j DNAT --to-destination 10.95.76.87:8020
$ sudo iptables -t nat -A POSTROUTING -p tcp -d 10.95.76.87 --dport 8020 -j SNAT --to-source 10.95.76.89
$ sudo iptables -t nat -L
Chain PREROUTING (policy ACCEPT)
target     prot opt source               destination         
DNAT       tcp  --  anywhere             anywhere            tcp dpt:intu-ec-svcdisc to:10.95.76.87:8020 

Chain POSTROUTING (policy ACCEPT)
target     prot opt source               destination         
SNAT       tcp  --  anywhere             dev-fiwr-bignode-01.hi.inet tcp dpt:intu-ec-svcdisc to:10.95.76.89 

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination
$ sudo iptables-save > /etc/iptables.conf
$ sudo bash -c "echo 'iptables-restore < /etc/iptables.conf' >> /etc/rc.local"
```

[Top](#top)

##<a name="section4"></a>Computing cluster
###<a name="section4.1"></a>Characteristics

* Number of nodes: 14 (1 Service Node + 2 Namenodes + 11 Datanodes)
* Total computing capacity: to be done.
* HDFS version: 2.4.0.2.1
* YARN + MapReduce version: 2.4.0.2.1
* Hive version: 0.13.0.2.1
* Oozie version: 4.0.0.2.1

|Private FQDN|Public IP and FQDN|Role|HDD (1)|RAM (2)|Installed software|
|---|---|---|---|---|---|
|dev-fiwr-svc-02.hi.inet|195.235.93.173/24, computing.cosmos.lab.fiware.org|Services node|2 TB + 2 TB|32 GB|cosmos-auth|
|dev-fiwr-bignode-11.hi.inet|N.A.|Active Namenode|2 TB + 2 TB|32 GB| HDFS, YARN, MapReduce |
|dev-fiwr-bignode-12.hi.inet|N.A.|Standby Namenode|500 GB|32 GB| HDFS, YARN, MapReduce |
|dev-fiwr-bignode-13.hi.inet|N.A.|Datanode|3 TB + 1 TB + 1 TB + 1 TB|32 GB|HDFS, YARN, MapReduce|
|dev-fiwr-bignode-14.hi.inet|N.A.|Datanode|3 TB + 1 TB + 1 TB + 1 TB|32 GB|HDFS, YARN, MapReduce|
|dev-fiwr-bignode-15.hi.inet|N.A.|Datanode|3 TB + 1 TB + 1 TB + 1 TB|32 GB|HDFS, YARN, MapReduce|
|dev-fiwr-bignode-16.hi.inet|N.A.|Datanode|3 TB + 1 TB + 1 TB + 1 TB|32 GB|HDFS, YARN, MapReduce|
|dev-fiwr-bignode-17.hi.inet|N.A.|Datanode|3 TB + 1 TB + 1 TB + 1 TB|32 GB|HDFS, YARN, MapReduce|
|dev-fiwr-bignode-18.hi.inet|N.A.|Datanode|3 TB + 1 TB + 1 TB + 1 TB|32 GB|HDFS, YARN, MapReduce|
|dev-fiwr-bignode-19.hi.inet|N.A.|Datanode|3 TB + 1 TB + 1 TB + 1 TB|32 GB|HDFS, YARN, MapReduce|
|dev-fiwr-bignode-20.hi.inet|N.A.|Datanode|3 TB + 1 TB + 1 TB + 1 TB|32 GB|HDFS, YARN, MapReduce|
|dev-fiwr-bignode-21.hi.inet|N.A.|Datanode|3 TB + 1 TB + 1 TB + 1 TB|32 GB|HDFS, YARN, MapReduce|
|dev-fiwr-bignode-28.hi.inet|N.A.|Datanode|3 TB + 1 TB + 1 TB + 1 TB|32 GB|HDFS, YARN, MapReduce|
|dev-fiwr-bignode-29.hi.inet|N.A.|Datanode|3 TB + 1 TB + 1 TB + 1 TB|32 GB|HDFS, YARN, MapReduce|

(1) `sudo fdisk -l`
(2) `cat /proc/meminfo | grep MemTotal`

[Top](#top)

###<a name="section4.2"></a>Services node details
####<a name="section4.2.1"></a>Some tools version:

```
$ node -v
v0.10.41
$ npm -v
1.4.29
$ g++ --version | grep g++
g++ (GCC) 4.4.7 20120313 (Red Hat 4.4.7-11)
$ cc --version | grep cc
cc (GCC) 4.4.7 20120313 (Red Hat 4.4.7-11)
```

####<a name="section4.2.2"></a>Opened ports summary
|From|To|Comment|
|---|---|---|
|Internet|computing.cosmos.lab.fiware.org:10000|HiveServer2|
|Internet|computing.cosmos.lab.fiware.org:11000|Oozie|
|Internet|computing.cosmos.lab.fiware.org:12000|Tidoop|
|Internet|computing.cosmos.lab.fiware.org:13000|cosmos-auth|
|TID's intranet|computing.cosmos.lab.fiware.org:22|ssh-based management interface|
|computing.cosmos.lab.fiware.org|account.lab.fiware.org:443|FIWARE Lab's Identity Manager|

[Top](#top)

####<a name="section4.2.3"></a>Oozie
To be done.

[Top](#top)

####<a name="section4.2.4"></a>Tidoop
To be done.

[Top](#top)

####<a name="section4.2.5"></a>Cosmos Authentication server (cosmos-auth)
It is running on port TCP/13000, user `cosmos-auth`:

```
$ sudo netstat -nap | grep 13000
tcp        0      0 0.0.0.0:13000               0.0.0.0:*                   LISTEN      8733/node
$ ps -ef | grep -v grep | grep 8733
cosmos-auth      8733  8727  0 12:58 ?        00:00:00 node ./src/server.js
```

####<a name="section4.2.6"></a>Hive
#####<a name="section4.2.6.1"></a>HiveServer2 forward
Port TCP/10000 for HiveServer2 opened and forwarded to `dev-fiwr-bignode-11.hi.inet:10000` (Active Namenode):

```
$ sudo bash -c "echo 1 > /proc/sys/net/ipv4/ip_forward"
$ sudo iptables -F
$ sudo iptables -t nat -F
$ sudo iptables -X
$ sudo iptables -t nat -A PREROUTING -p tcp --dport 10000 -j DNAT --to-destination 10.95.76.91:10000
$ sudo iptables -t nat -A POSTROUTING -p tcp -d 10.95.76.91 --dport 10000 -j SNAT --to-source 10.95.76.81:10000
$ sudo iptables -t nat -L
Chain PREROUTING (policy ACCEPT)
target     prot opt source               destination         
DNAT       tcp  --  anywhere             anywhere            tcp dpt:ndmp to:10.95.76.91:10000 

Chain POSTROUTING (policy ACCEPT)
target     prot opt source               destination         
SNAT       tcp  --  anywhere             dev-fiwr-bignode-11.hi.inet tcp dpt:ndmp to:10.95.76.81:10000 

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination    
```

[Top](#top)

#####<a name="section4.2.6.2"></a>Hive configuration for OAuth2 provider

The following properties has been added to `hive-site.xml` in order to enable a custom authentication provider, i.e. cosmos-hive-auth-provider and its `OAuth2AuthenticationProviderImpl` class:

```
<property>
   <name>hive.server2.authentication</name>
   <value>CUSTOM</value>
</property>

<property>
   <name>hive.server2.custom.authentication.class</name>
   <value>com.telefonica.iot.cosmos.hive.authprovider.OAuth2AuthenticationProviderImpl</value>
</property>
```

This other property has been modified in order to enable impersonation (on the contrary, all the queries are executed by the user `hive` instead of the real end user):

```
<property>
   <name>hive.server2.enable.doAs</name>
   <value>true</value>
</property>
```

[Top](#top)

#####<a name="section4.2.6.3"></a>OAuth2 provider installation
The cosmos-hive-auth-provider jar containing the `OAuth2AuthenticationProviderImpl` class has been copied into the installation directory of Hive:

```
$ ls /usr/lib/hive/lib/ | grep cosmos
cosmos-hive-auth-provider-0.0.0-SNAPSHOT-jar-with-dependencies.jar
```

[Top](#top)

##<a name="section5"></a>GUI
To be done.

[Top](#top)

##<a name="section6"></a>Reporting issues and contact information
There are several channels suited for reporting issues and asking for doubts in general. Each one depends on the nature of the question:

* Use [stackoverflow.com](http://stackoverflow.com) for specific questions about this software. Typically, these will be related to installation problems, errors and bugs. Development questions when forking the code are welcome as well. Use the `fiware-cygnus` tag.
* Use [ask.fiware.org](https://ask.fiware.org/questions/) for general questions about FIWARE, e.g. how many cities are using FIWARE, how can I join the accelarator program, etc. Even for general questions about this software, for instance, use cases or architectures you want to discuss.
* Personal email:
    * [francisco.romerobueno@telefonica.com](mailto:francisco.romerobueno@telefonica.com) **[Main contributor]**
    * [fermin.galanmarquez@telefonica.com](mailto:fermin.galanmarquez@telefonica.com) **[Contributor]**
    * [german.torodelvalle@telefonica.com](german.torodelvalle@telefonica.com) **[Contributor]**
    * [ivan.ariasleon@telefonica.com](mailto:ivan.ariasleon@telefonica.com) **[Quality Assurance]**

**NOTE**: Please try to avoid personaly emailing the contributors unless they ask for it. In fact, if you send a private email you will probably receive an automatic response enforcing you to use [stackoverflow.com](stackoverflow.com) or [ask.fiware.org](https://ask.fiware.org/questions/). This is because using the mentioned methods will create a public database of knowledge that can be useful for future users; private email is just private and cannot be shared.

[Top](#top)
