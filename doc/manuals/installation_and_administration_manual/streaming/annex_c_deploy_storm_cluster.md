#<a name="top"></a>Annex C: Deploy Apache Storm Cluster

Content:<br>

* [Prepare Operating System](#section1)
* [Deploy Storm](#section2)

In order to complete Sinfonier installation it's necessary to deploy an Apache Storm cluster. This reference is based on CentOS 7 operating system and some specific software versions.

##<a name="section1"></a>Prepare Operating System

This guide use [CentOS 7](https://www.centos.org/) as based system where deploy Storm.

**Add repositories**

    https://github.com/CentOS/sig-atomic-buildscripts

**Update your system**

    $ sudo yum update

**Install Java 7 SDK**

    http://www.oracle.com/technetwork/es/java/javase/downloads/jdk7-downloads-1880260.html

**Install Development tools**
    
    $ sudo yum groupinstall "Development Tools"

[Top](#top)

##<a name="section2"></a>Deploy Storm

### Install zookeeper

**Add cloudera repositories**

To download and install the CDH4 "1-click Install" package

    $ wget http://www.cloudera.com/content/www/en-us/documentation/archive/cdh/4-x/4-7-1/CDH4-Installation-Guide/cdh4ig_topic_4_4.html
    
    $ sudo yum --nogpgcheck localinstall cloudera-cdh-4-0.x86_64.rpm

    $ sudo yum repolist | grep cloudera-cdh4
    cloudera-cdh4 Cloudera's Distribution for Hadoop, Version 4 111

**Install Zookeeper**

    $ sudo yum install zookeeper zookeeper-server

**Init and Start**

    service zookeeper-server init
    service zookeeper-server start

### Storm

**Create Storm user**

    $ sudo groupadd -g 53001 storm
    $ sudo mkdir -p /app/home
    $ sudo useradd -u 53001 -g 53001 -d /app/home/storm -s /bin/bash storm -c "Storm service account"
    $ sudo chmod 700 /app/home/storm
    $ sudo chage -I -1 -E -1 -m -1 -M -1 -W -1 -E -1 storm

**Download Storm**

    $ cd /tmp
    $ wget http://apache.rediris.es/storm/apache-storm-0.9.6/apache-storm-0.9.6.zip
    $ cd /usr/local
    $ sudo unzip /tmp/storm-0.9.6.zip
    $ sudo chown -R storm:storm storm-0.9.6
    $ sudo ln -s storm-0.9.6 storm

**Create local working directory for Storm**

    $ sudo mkdir -p /app/storm
    $ sudo chown -R storm:storm /app/storm
    $ sudo chmod 750 /app/storm

**Configure Storm**

Open conf/storm.yaml in a text editor and change/set the following configuration parameters:

    storm.zookeeper.servers:
        - "localhost"
    supervisor.slots.ports:
        - 6700
    - 6701
    - 6702
    - 6703
    nimbus.host: "localhost"
    nimbus.childopts: "-Xmx1024m -Djava.net.preferIPv4Stack=true"
    ui.childopts: "-Xmx768m -Djava.net.preferIPv4Stack=true"
    supervisor.childopts: "-Djava.net.preferIPv4Stack=true"
    worker.childopts: "-Xmx512m -Djava.net.preferIPv4Stack=true"
    storm.local.dir: "/app/storm"

### Supervisord

Running Storm daemons under supervision

**Install RHEL EPEL repository**

    $sudo yum -y install epel-release

**Install supervisord**

    $ sudo yum install supervisor
    $ sudo chkconfig supervisord on
    # Recommended: secure supervisord configuration file
    $ sudo chmod 600 /etc/supervisord.conf

**Create log directories for Storm**

    $ sudo mkdir -p /var/log/storm
    $ sudo chown -R storm:storm /var/log/storm

**Configure supervisord for Storm**

    [program:storm-nimbus]
    command=/usr/local/storm/bin/storm nimbus
    user=storm
    autostart=true
    autorestart=true
    startsecs=10
    startretries=999
    log_stdout=true
    log_stderr=true
    logfile=/var/log/storm/nimbus.out
    logfile_maxbytes=20MB
    logfile_backups=10

    [program:storm-ui]
    command=/usr/local/storm/bin/storm ui
    user=storm
    autostart=true
    autorestart=true
    startsecs=10
    startretries=999
    log_stdout=true
    log_stderr=true
    logfile=/var/log/storm/ui.out
    logfile_maxbytes=20MB
    logfile_backups=10

    [program:storm-supervisor]
    command=/usr/local/storm/bin/storm supervisor
    user=storm
    autostart=true
    autorestart=true
    startsecs=10
    startretries=999
    log_stdout=true
    log_stderr=true
    logfile=/var/log/storm/supervisor.out
    logfile_maxbytes=20MB
    logfile_backups=10

    [program:storm-logviewer]
    command=/usr/local/storm/bin/storm logviewer
    user=storm
    autostart=true
    autorestart=true
    startsecs=10
    startretries=999
    log_stdout=true
    log_stderr=true
    logfile=/var/log/storm/logviewer.out
    logfile_maxbytes=20MB
    logfile_backups=10

**Check Status**

    supervisor> status
    storm-logviewer RUNNING pid 11933, uptime 0:00:10
    storm-nimbus RUNNING pid 11935, uptime 0:00:10
    storm-supervisor RUNNING pid 11932, uptime 0:00:10
    storm-ui RUNNING pid 11934, uptime 0:00:10

### Maven

**Install binaries**

    cd /tmp
    wget http://apache.rediris.es/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.zip
    cd /usr/local/
    sudo unzip /tmp/apache-maven-3.3.9-bin.zip
    sudo ln -s apache-maven-3.3.9/ maven

We will use /usr/local/storm and /usr/local/maven to configure Sinfonier API