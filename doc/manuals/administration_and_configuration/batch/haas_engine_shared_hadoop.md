#<a name="top"></a>HAAS engine (shared Hadoop version)

Content:<br>

* [Installation](#section1)
    * [Installing the cluster](#section1.1)
    * [Installing the services node](#section1.2)
* [Configuration](#section2)
    * [Configuring the server](#section2.1)
    * [Configuring the services node](#section2.2)
* [Running](#section3)
* [Administration](#section4)

##<a name="section1"></a>Installation

###<a name="section1.1"></a>Installing the cluster

You can setup a Hadoop cluster by following the [official
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

This is a complete Hadoop cluster, thus it is mandatory to install HDFS,
YARN and MapReduce2 at least. Other analysis tools such as Hive are
recommendable. Complete list of services and daemons is:

-   HDFS service:
    -   (Active) Namenode (mandatory)
    -   (Stand-by) Namenode (optional)
    -   SecondaryNamende (optional)
    -   Datanodes (mandatory)
-   YARN service:
    -   ResourceManager (mandatory)
    -   Scheduler (mandatory)
    -   Timeline (mandatory)
-   MapReduce2
    -   HistoryServer (mandatory)
-   Hive service
    -   HiveMetastore (mandatory)
    -   HiveServer2 (mandatory)
    -   MySQLServer (mandatory)

[Top](#top)

###<a name="section=1.2"></a>Installing the services node

In addition to the Hadoop cluster, it is highly recommended to deploy a
special node not being part of the cluster (i.e. not hosting any Hadoop
daemon) but having installed the Hadoop libraries and a copy of all the
configuration files of the cluster. The reason is this node may work as
the unique endpoint for the computing services, hiding the details of
the cluster and thus saving a lot of public IP addresses (this node is
the only one exposing a public one).

Available services should be:

-   Hive server.
-   Oozie server.
-   ssh server.

Of course, you can achieve the same goals by exposing those services in
one of the nodes of the cluster and allowing a public access to such a
node. But this is not recommended in terms of performance (just think
the services must share the resources of the node with the Hadoop
daemons) and security (you don't want any user get access to a machine
effectively computing any other user's analysis).

Finally, you may want to install certain development tools such as
Maven, git and so on, in order the users find them already available,
avoiding each one installs his/her own copy of those tools.

[Top](#top)

##<a name="section2"></a>Configuration

###<a name="section2.1"></a>Configuring the cluster

The different managers/installers developed by the Hadoop distributions
do most of the work for you regarding the configuration. Simply follow
their "next-next" wizards and you will be done.

Nevertheless, for further reference, these are the configutration files
used by Hadoop:

-   Read-only default configurations, when no site-specific ones are
    given:
    -   `/etc/hadoop/conf/[http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/core-default.xml core-default.xml]`
    -   `/etc/hadoop/conf/[http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/hdfs-default.xml hdfs-default.xml]`
    -   `/etc/hadoop/conf/[http://hadoop.apache.org/docs/current/hadoop-mapreduce-client/hadoop-mapreduce-client-core/mapred-default.xml mapred-default.xml]`
    -   `/etc/hadoop/conf/[http://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-common/yarn-default.xml yarn-default.xml]`
-   Site-specific configurations:
    -   `/etc/hadoop/conf/core-site.xml`
    -   `/etc/hadoop/conf/hdfs-site.xml`
    -   `/etc/hadoop/conf/mapred-site.xml`
    -   `/etc/hadoop/conf/yarn-default.xml`

[Top](#top)

###<a name="section=2.2"></a>Configuring the services node

Hive and Oozie will be usually installed by your distribution manager
(if you enable them), and thus they will be ready to be used.
Nevertheless, for further reference, these are the configutration files
used:

-   Read-only default configurations, when no site-specific ones are
    given:
    -   `/etc/hadoop/conf/hive-default.xml`
    -   `/etc/hadoop/conf/oozie-default.xml`
-   Site-specific configurations:
    -   `/etc/hadoop/conf/hive-site.xml`
    -   `/etc/hadoop/conf/oozie-site.xml`

More details on Hive configuration can be found
[here](http://cwiki.apache.org/confluence/display/Hive/GettingStarted#GettingStarted-ConfigurationManagementOverview).
The same for
[Oozie](http://oozie.apache.org/docs/4.2.0/AG_Install.html#Oozie_Configuration).

The ssh server could be used with the default configuration. More
relevant is the creation of an administrative Unix user with sudo
permissions and creating a public-private key pair for that user; the
public key must be installed. This user is required by the Cosmos GUI in
order to run centain administration commands on the storage cluster. See
annex A for more details about doing it.

[Top](#top)

##<a name="section3"></a>Running

Once again, the usage of a manager within any of the existent
distributions makes everything easier. These managers usually expose
very simple and intuitive means of starting and stopping a cluster.

Nevertheless, for further reference, these are the commands that
start/stop each one of the daemons the different Hadoop services run:

    $ (su -l hdfs -c) /usr/lib/hadoop/sbin/hadoop-daemon.sh --config /etc/hadoop/conf [start|stop] [namenode|datanode|journalnode]
    $ (su -l yarn -c) /usr/lib/hadoop-yarn/sbin/yarn-daemon.sh --config /etc/hadoop/conf [start|stop] [resourcemanager|nodemanager|historyserver]
    $ () /usr/lib/hadoop-mapreduce/sbin/mr-jobhistory-daemon.sh --config /etc/hadoop/conf [start|stop] [historyserver]

[Top](#top)

##<a name="section4"></a>Administration

To be done.

[Top](#top)