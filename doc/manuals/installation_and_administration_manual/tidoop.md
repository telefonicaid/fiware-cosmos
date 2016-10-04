#<a name="top"></a>Tidoop
Content:

* [Introduction](#section1)
* [Installation](#section2)
    * [Prerequisites](#section2.1)
    * [API installation](#section2.2)
    * [Unit tests](#section2.3)
* [Configuration](#section3)
* [Running](#section4)
* [Administration](#section5)
    * [Logging traces](#section5.1)
    * [Submitted jobs](#section5.2)

##<a name="section1"></a>Introduction
Tidoop is the codename for all the developments about [Hadoop](http://hadoop.apache.org/) made by FIWARE team at Telefónica Investigación y Desarrollo (Telefónica Research and Development, in english), or <i>TID</i> in its abreviated form.

Tidoop comprises several different projects:

* API extensions for Hadoop (tidoop-hadoop-ext).
* MapReduce job library (tidoop-mr-lib).
* REST API for the above MapReduce job library (tidoop-mr-lib-api).

Fully detailed information about Tidoop can be found at [Gihub](http://github.com/telefonicaid/fiware-tidoop).

[Top](#top)

##<a name="section2"></a>Installation
This is a software written in JavaScript, specifically suited for [Node.js](https://nodejs.org) (<i>JavaScript on the server side</i>). JavaScript is an interpreted programming language thus it is not necessary to compile it nor build any package; having the source code downloaded somewhere in your machine is enough.

###<a name="section2.1"></a>Prerequisites
This REST API has no sense if tidoop-mr-lib is not installed. And tidoop-mr-lib has only sense in a [Hadoop](http://hadoop.apache.org/) cluster, thus both the library and Hadoop are required.

As said, cosmos-tidoop-api is a Node.js application, therefore install it from the official [download](https://nodejs.org/download/). An advanced alternative is to install [Node Version Manager](https://github.com/creationix/nvm) (nvm) by creationix/Tim Caswell, which will allow you to have several versions of Node.js and switch among them.

Of course, common tools such as `git` and `curl` are needed.

[Top](#top)

###<a name="section2.2"></a>API installation
Start by creating, if not yet created, a Unix user named `cosmos-tidoop`; it is needed for installing and running the application. You can only do this as root, or as another sudoer user:

    $ sudo useradd cosmos-tidoop
    $ sudo passwd cosmos-tidoop <choose_a_password>

While you are a sudoer user, create a folder for saving the cosmos-tidoop-api log traces under a path of your choice, typically `/var/log/cosmos/cosmos-tidoop-api`, and set `cosmos-tidoop` as the owner:

    $ sudo mkdir -p /var/log/cosmos/cosmos-tidoop-api
    $ sudo chown -R cosmos-tidoop:cosmos-tidoop /var/log/cosmos

Now it is time to enable the `cosmos-tidoop` user to run Hadoop commands as the requesting user. This can be done in two ways:

* Adding the `cosmos-tidoop` user to the sudoers list. This is the easiest way, but the most dangerous one.
* Adding the `cosmos-tidoop` user to all the user groups (by default, for any user there exists a group with the same name than the user). This is only useful if, and only if, the group permissions are as wide open as the user ones (i.e. `77X`).

Once , change to the new fresh `cosmos-tidoop` user:

    $ su - cosmos-tidoop

Then, clone the fiware-cosmos repository somewhere of your ownership:

    $ git clone https://github.com/telefonicaid/fiware-cosmos.git

cosmos-tidoop-api code is located at `fiware-cosmos/cosmos-tidoop-api`. Change to that directory and execute the installation command:

    $ cd fiware-cosmos/cosmos-tidoop-api
    $ git checkout release/x.y.z
    $ npm install

That must download all the dependencies under a `node_modules` directory.

[Top](#top)

###<a name="section2.3"></a>Unit tests
To be done.

[Top](#top)

##<a name="section3"></a>Configuration
cosmos-tidoop-api is configured through a JSON file (`conf/cosmos-tidoop-api.json`). These are the available parameters:

* **host**: FQDN or IP address of the host running the service. Do not use `localhost` unless you want only local clients may access the service.
* **port**: TCP listening port for incoming API methods invocation. 12000 by default.
* **storage_cluster**:
    * **namenode_host**: FQDN or IP address of the Namenode of the storage cluster.
    * **namenode_ipc_port**: TCP listening port for Inter-Process Communication used by the Namenode of the storage cluster. 8020 by default.
* **log**:
    * **file_name**: Path of the file where the log traces will be saved in a daily rotation basis. This file must be within the logging folder owned by the the user `tidoop`.
    * **date_pattern**: Data pattern to be appended to the log file name when the log file is rotated.

[Top](#top)

##<a name="section4"></a>Running
The Http server implemented by cosmos-tidoop-api is run as (assuming your current directory is `fiware-cosmos/cosmos-tidoop-api`):

    $ npm start

If everything goes well, you should be able to remotely ask (using a web browser or `curl` tool) for the version of the software:

    $ curl -X GET "http://<host_running_the_api>:12000/tidoop/v1/version"
    {"version": "0.1.1"}

cosmos-tidoop-api typically listens in the TCP/12000 port, but you can change if by editing `conf/cosmos-tidoop-api.conf` as seen above.

[Top](#top)

##<a name="section5"></a>Administration
Two are the sources of data for administration purposes, the logs and the list of jobs launched.

[Top](#top)

###<a name="section5.1"></a>Logging traces
Logging traces, typically saved under `/var/log/cosmos/cosmos-tidoop-lib`, are the main source of information regarding the GUI performance. These traces are written in JSON format, having the following fields: level, message and timestamp. For instance:

    {"level":"info","message":"Connected to http://130.206.81.225:3306/cosmos_gui","timestamp":"2015-07-31T08:44:04.624Z"}

Logging levels follow this hierarchy:

    debug < info < warn < error < fatal

Within the log it is expected to find many `info` messages, and a few of `warn` or `error` types. Of special interest are the errors:

* ***Some error occurred during the starting of the Hapi server***: This message may appear when starting the API. Most probably the configured host IP address/FQDN does not belongs to the physical machine the service is running, or the configured port is already used.

[Top](#top)

###<a name="section5.2"></a>Submitted jobs
As an administrator, information regarding submitted jobs can be retrieved via the `hadoop job` command (it must be said such a command is the underlying mechanism the REST API uses in order to return information regarding MapReduce jobs). A complete reference for this command can be found in the official [Hadoop documentation](https://hadoop.apache.org/docs/r1.2.1/commands_manual.html#job).

[Top](#top)
