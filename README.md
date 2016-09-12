#Cosmos
[![License Badge](https://img.shields.io/badge/license-AGPL-blue.svg)](https://opensource.org/licenses/AGPL-3.0)
[![Documentation Status](https://readthedocs.org/projects/fiware-cosmos/badge/?version=latest)](http://fiware-cosmos.readthedocs.org/en/latest/?badge=latest)

This project is part of [FIWARE](http://fiware.org).

[Cosmos](http://catalogue.fiware.org/enablers/bigdata-analysis-cosmos) is the code name for the Reference Implementation of the BigData Generic Enabler of FIWARE.

Cosmos comprises several different sub-projects:

* A set of administration tools such as HDFS data copiers and much more, under [cosmos-admin](./cosmos-admin) folder.
* An OAuth2 tokens generator, under [cosmos-auth](./cosmos-auth) folder.
* A web portal for users and accounts management, running MapReduce jobs and doing I/O of big data, under [cosmos-gui](./cosmos-gui) folder.
* A custom authentication provider for Hive, under [cosmos-hive-auth-provider](./cosmos-hive-auth-provider).
* A REST API for running MapReduce jobs in a shared Hadoop cluster, under [cosmos-tidoop-api](./cosmos-tidoop-api).
* A specific OAuth2-base proxy for Http/REST operations [cosmos-proxy](./cosmos-proxy).

##<a name="contact"></a>Reporting issues and contact information
There are several channels suited for reporting issues and asking for doubts in general. Each one depends on the nature of the question:

* Use [stackoverflow.com](http://stackoverflow.com) for specific questions about this software. Typically, these will be related to installation problems, errors and bugs. Development questions when forking the code are welcome as well. Use the `fiware-cosmos` tag.
* Use [ask.fiware.org](https://ask.fiware.org/questions/) for general questions about FIWARE, e.g. how many cities are using FIWARE, how can I join the accelerator program, etc. Even for general questions about this software, for instance, use cases or architectures you want to discuss.
* Personal email:
    * [francisco.romerobueno@telefonica.com](mailto:francisco.romerobueno@telefonica.com) **[Main contributor]**
    * [fermin.galanmarquez@telefonica.com](mailto:fermin.galanmarquez@telefonica.com) **[Contributor]**
    * [german.torodelvalle@telefonica.com](german.torodelvalle@telefonica.com) **[Contributor]**
    * [pablo.coellovillalba@telefonica.com](pablo.coellovillalba@telefonica.com) **[Contributor]**

**NOTE**: Please try to avoid personally emailing the contributors unless they ask for it. In fact, if you send a private email you will probably receive an automatic response enforcing you to use [stackoverflow.com](http://stackoverflow.com) or [ask.fiware.org](https://ask.fiware.org/questions/). This is because using the mentioned methods will create a public database of knowledge that can be useful for future users; private email is just private and cannot be shared.
