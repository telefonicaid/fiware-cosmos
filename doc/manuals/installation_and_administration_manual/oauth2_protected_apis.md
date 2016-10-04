#<a name="top"></a>OAuth2-protected APIs

Content:<br>

* [OAuth2-protected REST APIs](#section1)
    * [Installation](#section1.1)
    * [Configuration](#section1.2)
    * [Running](#section1.3)
    * [Administration](#section1.4)
* [Other APIs protected with OAuth2](#section2)
    * [HiveServer2](#section2.1)

##<a name="section1"></a>OAuth2-protected REST APIs

Many tools from Hadoop Ecosystem, and others added by Cosmos Ecosystem, expose REST APIs. These APIs are not usually secured in terms of authentication nor authorization. Even in the case they provide any means of authenticating/authorizing the users, the mechanisms for doing so may be very heterogeneous.

For instance, [WebHDFS](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/WebHDFS.html), a RESTful API for I/O operations on the stored data, is installed as part of the HDFS service. This API provides several native [authentication mechanisms](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Authentication) that can be enabled (or not) in order to secure your API. Nevertheless, authorization is not natively provided and any other solution from Hadoop ecosystem should be used.

However, you can add authentication and authorization features to WebHDFS in a single step by integrating with FIWARE's [Identity Manager](http://catalogue.fiware.org/enablers/identity-management-keyrock) (IdM) and [Access Control](http://catalogue.fiware.org/enablers/authorization-pdp-authzforce) (AC), which are in charge of authentication and authorization respectively. This kind of integration is done thanks to a [proxy](http://catalogue.fiware.org/enablers/pep-proxy-wilma) that intercepts the calls to remote RESTful APIs and enforces they are authenticated against the IdM and authorized against the AC. Mode details on the architecture can be found [here](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/PEP_Proxy_-_Wilma_-_User_and_Programmers_Guide#Programmer_Guide). The whole picture is completed by adding an [OAuth2 Tokens
Generator](http://github.com/telefonicaid/fiware-cosmos/tree/develop/cosmos-auth), since everything works based on [OAuth2](http://oauth.net/2/).

[Top](#top)

###<a name="section1.1"></a>Installation

Please refer to this [Installation and Administration Guide](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/PEP_Proxy_-_Wilma_-_Installation_and_Administration_Guide) in order to install Wilma PEP Proxy.

Please refer to the [installation section](http://github.com/telefonicaid/fiware-cosmos/blob/develop/cosmos-auth/README.md#installation) of the README in Github in order to install the OAuth2 Tokens Generator.

[Top](#top)

###<a name="section1.2"></a>Configuration

Please refer to this [Installation and Administration Guide](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/PEP_Proxy_-_Wilma_-_Installation_and_Administration_Guide) in order to configure Wilma PEP Proxy.

Please refer to the [configuration section](http://github.com/telefonicaid/fiware-cosmos/blob/develop/cosmos-auth/README.md#configuration) of the README in Github in order to configure the OAuth2 Tokens Generator.

[Top](#top)

###<a name="section1.3"></a>Running

Please refer to this [Installation and Administration Guide](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/PEP_Proxy_-_Wilma_-_Installation_and_Administration_Guide) in order to run Wilma PEP Proxy.

Please refer to the [running section](http://github.com/telefonicaid/fiware-cosmos/blob/develop/cosmos-auth/README.md#running) of the README in Github in order to configure the OAuth2 Tokens Generator.

[Top](#top)

###<a name="section1.4"></a>Administration

Please refer to this [Installation and Administration Guide](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/PEP_Proxy_-_Wilma_-_Installation_and_Administration_Guide) in order to administrate Wilma PEP Proxy.

Please refer to the [administration section](http://github.com/telefonicaid/fiware-cosmos/blob/develop/cosmos-auth/README.md#administration) of the README in Github in order to configure the OAuth2 Tokens Generator.

[Top](#top)

##<a name="section2"></a>Other APIs protected with OAuth2
###<a name="section2.1"></a>HiveServer2
There exist the possibility to configure custom authentication providers for Hive and its server, HiveServer2. In this sense, we have developed [cosmos-hive-auth-provider](https://github.com/telefonicaid/fiware-cosmos/tree/master/cosmos-hive-auth-provider), a OAuth2-based authentication provider. Please, check the [README](https://github.com/telefonicaid/fiware-cosmos/blob/master/cosmos-hive-auth-provider/README.md) in order to learn how to install, configure, run and use it.

[Top](#top)
