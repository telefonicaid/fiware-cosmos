#Cosmos GUI
This project is part of [FIWARE](http://fiware.org).

[Cosmos](http://catalogue.fiware.org/enablers/bigdata-analysis-cosmos) is the codename for the Reference Implementation of the BigData Generic Enabler of FIWARE. Such a solution is based on the split of storage and computing capabilities:

* A only-[HDFS](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsUserGuide.html) cluster for permanently storing the user data.
* Depending on the available resources and the goals pursued by your deployment, there are two flavours for the computing side:
    * Another Hadoop cluster, shared among all the users, addressing data processing and only allowing for temporal storage.
    * A [Sahara](https://wiki.openstack.org/wiki/Sahara)-based platform for on-demand private temporal Hadoop clusters.

As seen, the storage cluster is always shared, and depending on the chosen flavour, the computing cluster is shared as well. Thus a provisioning procedure is require in order to create specific Unix users and HDFS user spaces within both clusters; this is also know as creating a <i>Cosmos account</i>. This procedure is automated by this cosmos-gui, a Node.js application rendering a set of web pages mainly in charge of guiding the user through this provisioning step.

In addition, the cosmos-gui can be used as a centralized dashboard where a user can explore its HDFS space and run [predefined MapReduce](https://github.com/telefonicaid/fiware-tidoop/tree/develop/tidoop-mr-lib-api) jobs, once his/her Cosmos account has been provisioned.

[Transport Layer Security](https://en.wikipedia.org/wiki/Transport_Layer_Security) (TLS) is used to provide communications security through asymetric cryptography (public/private encryption keys).

Further information can be found in the documentation at [fiware-cosmos.readthedocs.io](http://fiware-cosmos.readthedocs.io/en/latest/).
