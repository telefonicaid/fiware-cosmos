#<a name="top"></a>Some words about Cosmos and its ecosystem

Content:<br>

* [Cosmos architecture reminder](#section1)
* [Light version](#section2)
* [What is mandatory and optional](#section3)

##<a name="section1"></a>Cosmos architecture reminder

As previusly said, Cosmos (and its ecosystem) is part of a platform about providing BigData analysis means for data scientists, avoiding them to deploy any kind of infrastructure nor any kind of software, focusing on the analysis. So, the core idea of Cosmos is the on-demand provision of infrastructure supporting the desired analysis software that, once used, is released in order future users may have the opportunity to request resources as well.

On the one hand, the infrastructure usually comprises a cluster of machines since BigData is commonly processed in a distributed fashion. Machines can be physical or virtual; our implementation performs a mix of both types, being [Openstack](http://www.openstack.org/) the chosen technology for virtualization.

On the other hand, regarding the analysis software we consider the following tools as candidate to be installed on top of the provisioned cluster:

* [Apache Hadoop](http://hadoop.apache.org/). Natively supported by Sahara.
* [Apache Spark](http://spark.apache.org/). Supported through a plugin (under study).
* [Apache Flink](http://flink.apache.org/) (under study).

Regarding the on-demand provision of Hadoop clusters (also known as Hadoop As A Service, or simply HAAS), we were relying in the past in an infrastructure and software [provision system of our own](http://github.com/telefonicaid/fiware-cosmos-platform), able to deploy Hadoop clusters on-demand. That part of the product was fine when no technologies like [Openstack's Sahara](http://docs.openstack.org/developer/sahara/) were available. Now, it has no sense to continue with it, and it is more interesting for us (and the community of developers) to contribute to a project like Openstack's Sahara instead, due to:

* Sahara natively integrates with Openstack, the virtualization infrastructure used in FIWARE, therefore the "Hadoop as a Service" engine would be much better integrated with OpenStack-based clouds like the FIWARE Lab.
* Sahara allows deploying not only Hadoop clusters but at least Spark and Storm clusters as well (it is only a matter of creating the appropriate plugin).
* Using Sahara reinforces sustainability in the long term.

Within Cosmos, computing and storage are independent concepts. Thus, in addition to the above computing platform, the proposed solution also provides a *permanent* and *unlimited* HDFS cluster for data storage purposes; since the demanded analysis clusters are temporal in the sense once used they are deleted and the resources released, the input, and most important, the output data must be saved somewhere stable.

Both storage and computing clusters are glued by using the [Cosmos GUI](http://github.com/telefonicaid/fiware-cosmos/tree/develop/cosmos-gui), a portal provisioning Cosmos accounts, i.e. provisioning a HDFS space for the user and giving access to Sahara features about creating on-demand clusters.

The ecosystem raises when Cosmos is completed/complemented with certain management and utility software:

* [Cygnus](http://github.com/telefonicaid/fiware-cygnus), a tool feeding the permanent and unlimited HDFS-based storage cluster with context data coming from Orion Context Broker; this builds historical views of the context data.
* [Tidoop MR Library](http://github.com/telefonicaid/fiware-tidoop/tree/master/tidoop-mr-lib) and its [RESTful API](http://github.com/telefonicaid/fiware-tidoop/tree/master/tidoop-mr-lib-api), a tool for designing compositions of chained MapReduce jobs based on general building blocks.
* [Hadoop extensions](http://github.com/telefonicaid/fiware-tidoop/tree/master/tidoop-hadoop-ext) for using non HDFS data.
* [Wilma PEP Proxy](http://github.com/ging/fi-ware-pep-proxy) together with [OAuth2 Tokens Generator](http://github.com/telefonicaid/fiware-cosmos/tree/develop/cosmos-auth) if wanting to implement OAuth2-based authentication and authorization in your REST APIs.

![Figure 2 - Big Data architecture reminder](big_data_installation_guide_figure_2.png "Figure 2 - Big Data architecture reminder")

[Top](#top)

##<a name="section2"></a>Light version

Since the above solution may require a very large infrastructure (for instance, let’s suppose an operator willing to provide on-demand clusters for at least 1000 users at the same time, having each cluster at least 20 virtual machines… that implies the capability of creating at least 20000 VMs), a light version of the HAAS engine has been developed at the same time, specially addressed for little operators and companies willing to provide this kind of service but not owning large resources. This light version is based on sharing a single Hadoop cluster; this sharing will be controlled by software in charge of limiting the access, distributing the available resources, prioritizing jobs, etc.

Indeed, this is the version currently deployed in FIWARE Lab.

![Figure 3 - Light-version Big Data architecture](big_data_installation_guide_figure_3.png "Figure 3 - Light-version Big Data architecture")

##<a name="section3"></a>What is mandatory and optional

As already seen, this is not a <i>install-a-single-rpm</i> GEri, but a set of many tools (proprietary or third-party ones) that have to be chosen and combined in order to achieve an implementation.

The following tools are mandatory in order to achieve a minimal implementation:

* Cosmos (HAAS engine):
    * Based on Sahara (uncludes a dashboard based on [Openstack's Horizon](http://docs.openstack.org/developer/horizon/)); or
    * Based on a shared Hadoop.
* HDFS-based storage cluster.
* Cosmos GUI.

While these others are optional and depend on your needs:

* Cygnus; install it only if you want to create historics from context data managed by [Orion Context Broker](http://catalogue.fiware.org/enablers/publishsubscribe-context-broker-orion-context-broker).
* Tidoop MR library and its RESTful API; your users may always use their own MapReduce jobs, this is *only* a library of ready-to-use general purpose jobs.
* Hadoop extensions; install it if you want yours users have access to non HDFS data such as the one stored in [CKAN Open Data](http://ckan.org/).
* PEP proxy + OAuth2 Tokens Generator; only if you expect to protect your REST APIs with OAuth2.
    
[Top](#top)
