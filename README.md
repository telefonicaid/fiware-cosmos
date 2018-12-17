# <a name="top"></a>Cosmos
[![License Badge](https://img.shields.io/badge/license-AGPL-blue.svg)](https://opensource.org/licenses/AGPL-3.0)
[![Documentation Status](https://readthedocs.org/projects/fiware-cosmos/badge/?version=latest)](http://fiware-cosmos.readthedocs.org/en/latest/?badge=latest)

This project is part of [FIWARE](http://fiware.org).

[Cosmos](http://catalogue.fiware.org/enablers/bigdata-analysis-cosmos) is the code name for the Reference Implementation of the BigData Generic Enabler of FIWARE, a set of tools and developments helping in the task of enabling a Hadoop as a Service (HasS) deployment:

* A set of administration tools such as HDFS data copiers and much more, under [cosmos-admin](./cosmos-admin) folder.
* An OAuth2 tokens generator, under [cosmos-auth](./cosmos-auth) folder.
* A web portal for users and accounts management, running MapReduce jobs and doing I/O of big data, under [cosmos-gui](./cosmos-gui) folder.
* A custom authentication provider for Hive, under [cosmos-hive-auth-provider](./cosmos-hive-auth-provider).
* A REST API for running MapReduce jobs in a shared Hadoop cluster, under [cosmos-tidoop-api](./cosmos-tidoop-api).
* A specific OAuth2-base proxy for Http/REST operations, under [cosmos-proxy](./cosmos-proxy).

[Top](#top)

## If you want to use Cosmos Global Instance in FIWARE Lab
If you are looking for information regarding the specific deployment of Cosmos Global Instance in FIWARE Lab, a HaaS ready to use, please check this documentation:

* [Quick Start Guide](./doc/manuals/quick_start_guide_new.md) for Cosmos users.
* Details on using [OAuth2 tokens](./doc/manuals/user_and_programer_manual/using_oauth2.md) as authentication and authorization mechanism.
* Details on using [WebHDFS](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/WebHDFS.html) REST API for data I/O (you can also check [this](./doc/manuals/user_and_programer_manual/data_management_and_io.md) link).
* Details on using [Tidoop](./doc/manuals/user_and_programer_manual/using_tidoop.md) REST API for MapReduce job submission.
* Details on developing [MapReduce jobs and Hive clients](./doc/manuals/user_and_programer_manual/using_hadoop_and_ecosystem.md) (Already developed Hive clients can also be found [here](./resources/hiveclients/)).
* In general, you may be insterested in the [User and Programming Guide](./doc/manuals/user_and_programer_manual), also available in [readthedocs](http://fiware-cosmos.readthedocs.io/en/latest/).

[Top](#top)

## If you want to deploy and use your own private Hadoop instance
This is the case you don't rely on the Global Instance of Cosmos in FIWARE Lab. In this case, you'll have to install, configure and manage your own Hadoop private instance. The Internet is plenty of documentation that will help you.

[Top](#top)

## If you want to deploy your own public Cosmos instance
In the (extremly rare) case you are not interested in using the Global Instance of Cosmos or a private instance of Hadoop, but you want to become a Big Data service provider, and you want to base on Cosmos software, you may be interested in the following links:

* [Deployment details](doc/deployment_examples/cosmos/fiware_lab.md) for administrators trying to replicate Cosmos Global Instance in FIWARE Lab.
* In general, you may be insterested in the [Installation and Administration Guide](./doc/manuals/installation_and_administration_manual), also available in [readthedocs](http://fiware-cosmos.readthedocs.io/en/latest/).

[Top](#top)

## Reporting issues and contact information
There are several channels suited for reporting issues and asking for doubts in general. Each one depends on the nature of the question:

* Use [stackoverflow.com](http://stackoverflow.com) for specific questions about this software. Typically, these will be related to installation problems, errors and bugs. Development questions when forking the code are welcome as well. Use the `fiware-cosmos` tag.
* Use [ask.fiware.org](https://ask.fiware.org/questions/) for general questions about FIWARE, e.g. how many cities are using FIWARE, how can I join the accelerator program, etc. Even for general questions about this software, for instance, use cases or architectures you want to discuss.
* Personal email:
    * [francisco.romerobueno@telefonica.com](mailto:francisco.romerobueno@telefonica.com) **[Main contributor]**
    * [fermin.galanmarquez@telefonica.com](mailto:fermin.galanmarquez@telefonica.com) **[Contributor]**
    * [german.torodelvalle@telefonica.com](german.torodelvalle@telefonica.com) **[Contributor]**
    * [pablo.coellovillalba@telefonica.com](pablo.coellovillalba@telefonica.com) **[Contributor]**

**NOTE**: Please try to avoid personally emailing the contributors unless they ask for it. In fact, if you send a private email you will probably receive an automatic response enforcing you to use [stackoverflow.com](http://stackoverflow.com) or [ask.fiware.org](https://ask.fiware.org/questions/). This is because using the mentioned methods will create a public database of knowledge that can be useful for future users; private email is just private and cannot be shared.

[Top](#top)
