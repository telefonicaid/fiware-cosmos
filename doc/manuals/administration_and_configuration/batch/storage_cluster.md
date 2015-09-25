#<a name="top"></a>Storage cluster

Content:<br>

* [Installation](#section1)
    * [Installing the HDFS-only cluster](#section1.1)
    * [Installing the services node](#section1.2)
* [Configuration](#section2)
    * [Configuring the HDFS-only cluster](#section2.1)
    * [Configuring the services node](#section2.2)
* [Running](#section3)
    * [Running the HDFS-only cluster](#section3.1)
    * [Running the services node](#section3.2)
* [Administration](#section4)

##<a name="section1"></a>Installation

###<a name="section1.1"></a>Installing the HDFS-only cluster

You can setup a HDFS cluster by following the [official
guidelines](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/ClusterSetup.html),
which are pretty detailed (and probably complex for a newbie), or you
can use a Hadoop distribution with an installation manager that will
make your life easier. Well known distributions are:

-   [Hortonworks Data Platform (HDP)](http://hortonworks.com/hdp/).
    Please, visit this
    [link](http://docs.hortonworks.com/HDPDocuments/Ambari-2.0.1.0/index.html)
    for detailed instructions about how to install HDP.
-   [Cloudera Distribution for
    Hadoop (CDH)](http://www.cloudera.com/content/cloudera/en/downloads/cdh/cdh-5-4-2.html).
    Please, visit this
    [link](http://www.cloudera.com/content/cloudera/en/documentation/core/latest/topics/cm_ig_install_path_a.html#cmig_topic_6_5_unique_2)
    for detailed instructions about how to install CDH.
-   [MapR](http://www.mapr.com/). Please, visit this
    [link](http://www.mapr.com/products/hadoop-download) for detailed
    instructions about how to install MapR.

Tools from Cosmos Ecosystem have been tested with HDP 2.2, but should
work on any other Hadoop distribution.

Since this is a storage-only cluster, just install the HDFS service. Do
not install YARN nor MapReduce2 nor any other analysis tool such as
Hive. The complete list of services and daemons is:

-   HDFS service:
    -   (Active) Namenode (mandatory)
    -   (Stand-by) Namenode (optional)
    -   SecondaryNamende (optional)
    -   Datanodes (mandatory)

[Top](#top)

###<a name="section1.2"></a>Installing the services node

In addition to the Hadoop cluster, it is highly recommended to deploy a
special node not being part of the cluster (i.e. not hosting any Hadoop
daemon) but having installed the Hadoop libraries and a copy of all the
configuration files of the cluster. The reason is this node may work as
the unique endpoint for the computing services, hiding the details of
the cluster and thus saving a lot of public IP addresses (this node is
the only one exposing a public one).

Available services should be:

-   [HttpFS](http://hadoop.apache.org/docs/current/hadoop-hdfs-httpfs/index.html) server.
    This service works as a gateway of WebHDFS, implementing the same
    REST API but specifically designed to hide the IP address/FQDN of
    the nodes of the cluster, even in those WebHDFS operations based on
    redirections (e.g. [creating a
    file](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Create_and_Write_to_a_File)
    with initial content). HttpFS can be installed from
    [sources](http://hadoop.apache.org/docs/current/hadoop-hdfs-httpfs/ServerSetup.html),
    but if you finally used a Hadoop distribution, most probably you
    will be able to install it from a repo.
-   ssh server. In you want your users manage their HDFS userpace
    through the [File System
    Shell](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/FileSystemShell.html),
    they will need to ssh to this services node.

Of course, you can achieve the same goals by exposing those services in
one of the nodes of the cluster and allowing a public access to such a
node. But this is not recommended in terms of performance (just think
the services must share the resources of the node with the Hadoop
daemons) and security (you don't want any user get access to a machine
effectively storing any other user's data).

[Top](#top)

##<a name="section2"></a>Configuration

###<a name="section2.1"></a>Configuring the HDFS-only cluster

The different managers/installers developed by the Hadoop distributions
do most of the work for you regarding the configuration. Simply follow
their "next-next" wizards and you will be done.

Nevertheless, for further reference, these are the configutration files
used by Hadoop:

-   Read-only default configurations, when no site-specific ones are
    given:
    -   `/etc/hadoop/conf/[http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/core-default.xml core-default.xml]`
    -   `/etc/hadoop/conf/[http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/hdfs-default.xml hdfs-default.xml]`
-   Site-specific configurations:
    -   `/etc/hadoop/conf/core-site.xml`
    -   `/etc/hadoop/conf/hdfs-site.xml`

[Top](#top)

###<a name="section2.2"></a>Configuring the services node

HttpFS must be configured as stated in the [official
documentation](http://hadoop.apache.org/docs/current/hadoop-hdfs-httpfs/ServerSetup.html).

The ssh server could be used with the default configuration. More
relevant is the creation of an administrative Unix user with sudo
permissions and creating a public-private key pair for that user; the
public key must be installed. This user is required by the Cosmos GUI in
order to run centain administration commands on the computing cluster.
See annex A for more details about doing it.

[Top](#top)

##<a name="section3"></a>Running

###<a name="section3.1"></a>Running the HDFS-only cluster

Once again, the usage of a manager within any of the existent
distributions makes everything easier. These managers usually expose
very simple and intuitive means of starting and stopping a cluster.

Nevertheless, for further reference, this is the command that start/stop
each one of the daemons the HDFS service run:

    $ (su -l hdfs -c) /usr/lib/hadoop/sbin/hadoop-daemon.sh --config /etc/hadoop/conf [start|stop] [namenode|datanode|journalnode]

[Top](#top)

###<a name="section3.2"></a>Running the services

As stated in the [official
documentation](http://hadoop.apache.org/docs/current/hadoop-hdfs-httpfs/ServerSetup.html),
httpfs is started/stopped/restarted by doing:

    $ /usr/lib/hadoop-httpfs/sbin/httpfs.sh [start|stop|restart]

[Top](#top)

##<a name="section4"></a>Administration

You can use the HDFS [administration
commands](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HDFSCommands.html#Administration_Commands).

[Top](#top)