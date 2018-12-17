# <a name="section=top"></a>Custom Http PEP proxy for Cosmos
Content:

* [Installation](#section1)
    * [Prerequisites](#section1.1)
    * [Installation](#section1.2)
    * [Unit tests](#section1.3)
* [Configuration](#section2)
* [Running](#section3)
* [Administration](#section4)

## <a name="section1"></a>Installation
### <a name="section1.1"></a>Prerequisites
This PER proxy has no sense if an Identity Manager (Keyrock implementation can be found [here](http://catalogue.fiware.org/enablers/identity-management-keyrock)) is not installed. The same applies to [Cosmos](http://catalogue.fiware.org/enablers/bigdata-analysis-cosmos).

cosmos-proxy is a Node.js application, therefore install it from the official [download](https://nodejs.org/download/). An advanced alternative is to install [Node Version Manager](https://github.com/creationix/nvm) (nvm) by creationix/Tim Caswell, which will allow you to have several versions of Node.js and switch among them.

Of course, common tools such as `git` and `curl` may be needed.

[Top](#top)

### <a name="section1.2"></a>Installation
This is a software written in JavaScript, specifically suited for [Node.js](https://nodejs.org) (<i>JavaScript on the server side</i>). JavaScript is an interpreted programming language thus it is not necessary to compile it nor build any package; having the source code downloaded somewhere in your machine is enough.

Start by creating, if not yet created, a Unix user named `cosmos-proxy`; it is needed for installing and running the application. You can only do this as root, or as another sudoer user:

    $ sudo useradd cosmos-proxy
    $ sudo passwd cosmos-proxy <choose_a_password>

While you are a sudoer user, create a folder for saving the cosmos-proxy log traces under a path of your choice, typically `/var/log/cosmos/cosmos-proxy`, and set `cosmos-proxy` as the owner:

    $ sudo mkdir -p /var/log/cosmos/cosmos-proxy
    $ sudo chown cosmos-proxy:cosmos-proxy /var/log/cosmos/cosmos-proxy

Additionally, while you are a sudo user, create a folder for store the cache file that will provide the pairs `user:token` if proxy shutdown.

    $ sudo mkdir -p /etc/cosmos/cosmos-proxy
    $ sudo chown cosmos-proxy:cosmos-proxy /etc/cosmos/cosmos-proxy

Now, change to the new fresh `cosmos-proxy` user:

    $ su - cosmos-proxy

Then, clone the Cosmos repository somewhere of your ownership:

    $ git clone https://github.com/telefonicaid/fiware-cosmos.git

Change to the `cosmos-proxy` directory, change the branch from `master` to `develop` and execute the installation command:

    $ cd fiware-comos/cosmos-proxy
    $ git checkout release/x.y.z
    $ npm install

That must download all the dependencies under a `node_modules` directory.

[Top](#top)

### <a name="section1.3"></a>Unit tests
To be done.

[Top](#top)

## <a name="section2"></a>Configuration
cosmos-proxy is configured through a JSON file. These are the available parameters:

* **host**: FQDN or IP address of the host running the proxy.
* **port**: TCP listening port for incoming proxied requests.
* **target**:
    * **host**: FQDN or IP address of the host running the real service.
    * **port**: TCP listening port of the real service.
* **idm**:
    * **host**: FQDN or IP address where the Identity Manager runs. Do not write it in URL form!
    * **port**: port where the Identity Manager listens for requests. Typically 443.
* **public\_paths\_list**: paths can be reached for all users.
* **superuser**: superuser authorized to access all the HDFS paths.
* **log**:
    * **file_name**: path of the file where the log traces will be saved in a daily rotation basis. This file must be within the logging folder owned by the the user `cosmos-auth`.
    * **date_pattern**: data pattern to be appended to the log file name when the log file is rotated.
* **cache_file**: path of the file where the pairs `user:token` will be saved. This file will be used in the case the proxy shutdown.

[Top](#top)

## <a name="section3"></a>Running
The PEP proxy implemented by cosmos-proxy is run as (assuming your current directory is `cosmos-proxy`):

    $ npm start

If everything goes well, you should be able to see in the logs at `/var/log/cosmos/cosmos-proxy`:

    {"level":"info","message":"Starting cosmos-proxy in 0.0.0.0:14000","timestamp":"2016-07-14T11:48:10.968Z"}

[Top](#top)

## <a name="section4"></a>Administration
Within cosmos-proxy there is a single source of information useful for administrating it: the logs.

Logging traces are typically saved under `/var/log/cosmos/cosmos-proxy`. These traces are written in JSON format, having the following fields: level, message and timestamp. For instance:

    {"level":"info","message":"Starting cosmos-proxy in 0.0.0.0:14000","timestamp":"2016-07-14T11:48:10.968Z"}

Logging levels follow this hierarchy:

    debug < info < warn < error < fatal

Within the log it is expected to find many `info` messages, and a few of `warn` or `error` types. Of special interest are the errors:

* ***Authentication error***: The user could not be authenticated either because the token is not valid, either because the communication with the Keyrock Identity Manager is down.
* ***Authorization error***: The user could not be authorized or using the requested Cosmos resource: his/her ID did not match the Cosmos ID in the resource.

[Top](#top)
