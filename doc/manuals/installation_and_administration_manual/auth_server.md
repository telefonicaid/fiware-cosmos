# <a name="top"></a>Auth server
Content:

* [Installation](#section1)
    * [Prerequisites](#section1.1)
    * [Installation](#section1.2)
    * [Unit tests](#section1.3)
* [Configuration](#section2)
* [Running](#section3)
* [Administration](#section4)
* [Annexes](#section5)
    * [Annex A: Creating a self-signed certificate](#section5.1)

## <a name="section1"></a>Installation
This is a software written in JavaScript, specifically suited for [Node.js](https://nodejs.org) (<i>JavaScript on the server side</i>). JavaScript is an interpreted programming language thus it is not necessary to compile it nor build any package; having the source code downloaded somewhere in your machine is enough.

### <a name="section1.1"></a>Prerequisites
This REST API has no sense if an Identity Manager (Keyrock implementation can be found [here](http://catalogue.fiware.org/enablers/identity-management-keyrock)) is not installed.

As said, cosmos-auth is a Node.js application, therefore install it from the official [download](https://nodejs.org/download/). An advanced alternative is to install [Node Version Manager](https://github.com/creationix/nvm) (nvm) by creationix/Tim Caswell, which will allow you to have several versions of Node.js and switch among them.

Of course, common tools such as `git` and `curl` may be needed.

[Top](#top)

### <a name="section1.2"></a>Installation
Start by creating, if not yet created, a Unix user named `cosmos-auth`; it is needed for installing and running the application. You can only do this as root, or as another sudoer user:

    $ sudo useradd cosmos-auth
    $ sudo passwd cosmos-auth <choose_a_password>

While you are a sudoer user, create a folder for saving the cosmos-gui log traces under a path of your choice, typically `/var/log/cosmos/cosmos-auth`, and set `cosmos-auth` as the owner:

    $ sudo mkdir -p /var/log/cosmos/cosmos-auth
    $ sudo chown cosmos-auth:cosmos-auth /var/log/cosmos/cosmos-auth

Now, change to the new fresh `cosmos-auth` user:

    $ su - cosmos-auth

Then, clone the Cosmos repository somewhere of your ownership:

    $ git clone https://github.com/telefonicaid/fiware-cosmos.git

cosmos-auth code is located at `fiware-cosmos/cosmos-auth`. Change to that directory and execute the installation command:

    $ cd fiware-cosmos/cosmos-auth
    $ git checkout release/x.y.z
    $ npm install

That must download all the dependencies under a `node_modules` directory.

[Top](#top)

### <a name="section1.3"></a>Unit tests
To be done.

[Top](#top)

## <a name="section2"></a>Configuration
cosmos-auth is configured through a JSON file. These are the available parameters:

* **host**: FQDN or IP address of the host running the service.
* **port**: TCP listening port for incoming API methods invocation. 13000 by default.
* **private\_key\_file**: File name containing the private key used to encrypt the communications with the clients.
* **certificate\_file**: File name containing the self-signed X509 certificate used by the server to send the clients the public counterpart of the above private key.
* **idm**:
    * **host**: FQDN or IP address where the Identity Manager runs. Do not write it in URL form!
    * **port**: Port where the Identity Manager listens for requests. Typically 443.
    * **path**: Path where the Identity Managers serves the tokens generation. Typically `/oauth2/token`.
* **cosmos_app**:
    * **client\_id**: This value is given by the Identity Manager when the Cosmos application is registered. By configuring it here, the user has not the need to know about it.
    * **client\_secret**: This value is given by the Identity Manager when the Cosmos application is registered. By configuring it here, the user has not the need to know about it.
* **log**:
    * **file_name**: path of the file where the log traces will be saved in a daily rotation basis. This file must be within the logging folder owned by the the user `cosmos-auth`.
    * **date_pattern**: data pattern to be appended to the log file name when the log file is rotated.

[Top](#top)

## <a name="section3"></a>Running
The Http server implemented by cosmos-auth is run as (assuming your current directory is `fiware-cosmos/cosmos-auth`):

    $ npm start

If everything goes well, you should be able to remotely ask (using a web browser or `curl` tool) for the version of the software:

    $ curl -X GET "https://<host_running_the_api>:13000/cosmos-auth/v1/version"
    {version: 0.0.0}

cosmos-auth typically listens in the TCP/13000 port (TLS encryption), but you can change it by editing `conf/cosmos-auth.json`.

[Top](#top)

## <a name="section4"></a>Administration
Within cosmos-auth, there is a single source of information useful for administrating it: the logs.

Logging traces are typically saved under `/var/log/cosmos/cosmos-auth`. These traces are written in JSON format, having the following fields: level, message and timestamp. For instance:

    {"level":"info","message":"cosmos-auth running at http://localhost:13000","timestamp":"2015-07-28T14:15:28.746Z"}

Logging levels follow this hierarchy:

    debug < info < warn < error < fatal

Within the log it is expected to find many `info` messages, and a few of `warn` or `error` types. Of special interest are the errors:

* ***Some error occurred during the starting of the Hapi server***: This message may appear when starting cosmos-auth. Most probably the configured host IP address/FQDN does not belongs to the physical machine the service is running, or the configured port is already used .
* ***Could not connect to the IdM***: This message may appear when connecting to the identity server. Most probably the configured endpoint is not correct, or there is some network error like a port filtering, or the given credentials (cliend id and secret) regarding the application aimed to be authorized (in this case, any Cosmos REST API) are not valid.

[Top](#top)

## <a name="section5"></a>Annexes
### <a name="section5.1"></a>Annex A: Creating a self-signed certificate
First of all, create a private key; it may not be necessary if you already have one:

    $ openssl genrsa -out private-key.pem 1024

Second, create a Certificate Signing Request (CSR) using the private key:

    $ openssl req -new -key private-key.pem -out csr.pem

Finally, create the self-signed certificate:

    $ openssl x509 -req -in csr.pem -signkey private-key.pem -out public-cert.pem

[Top](#top)
