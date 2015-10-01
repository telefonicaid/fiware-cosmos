#<a name="top"></a>Introduction

This document details how to use and program with Cosmos Ecosystem and Sinfonier, the BigData Analysis Generic Enabler (BigData Analysis GE) reference implementations (GEri).

The BigData Analysis GE, as described in the [Architecture Description](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/FIWARE.ArchitectureDescription.Data.BigData), is intended to deploy means for analyzing both batch and stream data (in order to get, in the end, insights on such a data). These two different aspects of the GE lead to the usage of two specialized set of tools:

* Cosmos (either the *official* one based on [Openstack's Sahara](http://wiki.openstack.org/wiki/Sahara), either the light version based on a shared [Hadoop](http://hadoop.apache.org/) cluster), [Tidoop](http://github.com/telefonicaid/fiware-tidoop) and [Cygnus](http://github.com/telefonicaid/fiware-cygnus), conforming the Cosmos Ecosystem, for batch processing.
* [Storm](http://storm.apache.org/) and Sinfonier for stream processing.

Nevertheless, and according to the current versions of the software, please observe both set of tools are not necessary at the same time. So you can feel free to install one, the other or both. Even, not all the tools within a set are mandatory; please have a look on the description of each tool in order to know wether it suits for your deployment or not.

[Top](#top)

##<a name="section1"></a>Intended audience

This document is mainly addressed to those **developers aiming to use already deployed BigData Analysis GE-like services**.

If you are aiming to to expose BigData Analysis GE-like services, then please visit the Installation and Administration Guide. There you will find how to become a Big Data service provider.

[Top](#top)

##<a name="section2"></a>Structure of the document

Apart from this introduction, this User and Programmer Guide contains two main sections, one for batch and another one for stream analysis.

Regarding the batch chapter, the user will find instructions about how to manage and upload/download his/her data saved in the permanent storage; a specific section for Cygnus details how to feed the HDFS storage with context data coming from Orion Context Broker. Once the I/O is mastered, the chapter continues teaching the anatomy of a MapReduce application and how to develop and run one of them; a specific section has been added when dealing with CKAN data stored outside of the HDFS. If MapReduce results very difficult to understand for you, or you are looking for something easier, HiveQL is designed for you; you will learn how to query HDFS for selected data, both in a local (using the CLI) and a remote way (creating a custom Hive client). Finally, Oozie is explained as a data processing scheduler. The chapter closes with an explanation about how to deal with OAuth2-secured REST APIs.

[Top](#top)

##<a name="section3"></a>Reference repositories in Github

Apart from this repository (<http://github.com/telefonicaid/fiware-cosmos>), the following ones will be linked constantly through the whole document; hey are listed here for a clear reference:

* <http://github.com/telefonicaid/fiware-cygnus>
* <http://github.com/telefonicaid/fiware-tidoop>

[Top](#top)

##<a name="section4"></a>Reporting issues and contact information

There are several channels suited for reporting issues and asking for doubts in general. Each one depends on the nature of the question:

* Use [stackoverflow.com](http://stackoverflow.com) for specific questions about the GE/GEri. Typically, these will be related to installation problems, errors and bugs. Development questions when forking the code are welcome as well. There are several tags that can be used to categorize the issue:
   * fiware-cosmos
   * fiware-tidoop
   * fiware-cygnus
   * fiware-sinfonier
   * storm (please observe in this case we are not the main supporters of Apache Storm)
* Use [ask.fiware.org](http://ask.fiware.org/questions/) for general questions about FIWARE, e.g. how many cities are using FIWARE, how can I join the accelarator program, etc. Even for general questions about this software, for instance, use cases or architectures you want to discuss.
* Personal email:
    * <francisco.romerobueno@telefonica.com> (Cosmos Ecosystem)
    * <franciscojesus.gomezrodriguez@telefonica.com> (Sinfonier)

**NOTE**: Please try to avoid personaly emailing the GE owners unless they ask for it. In fact, if you send a private email you will probably receive an automatic response enforcing you to use [stackoverflow.com](http://stackoverflow.com) or [ask.fiware.org](http://ask.fiware.org/questions/). This is because using the mentioned methods will create a public database of knowledge that can be useful for future users; private email is just private and cannot be shared.

[Top](#top)

