#<a name="top"></a>OAuth2 in Cosmos APIs
Content:

* [Requesting a token](#section1)
* [Using the token](#section2)
* [Using the token in Hive](#section3)

##<a name="section1"></a>Requestig a token
Before using any REST API protected by [OAuth2](http://oauth.net/2/), you must request a token to the Cosmos Tokens Generator you must have installed somewhere. This is a service that will be listening in TCP/13000 port (in FIWARE Lab, this is `computing.cosmos.lab.fiware.org:13000`. You can do this using any REST client of your choice, the easiest way is using the `curl` command:

    $ curl -k -X POST "https://<tokens_generator_host>:13000/cosmos-auth/v1/token" -H "Content-Type: application/x-www-form-urlencoded" -d "grant_type=password&username=<registered_email_in_imd>&password=<password_in_idm>"
    {"access_token": "qjHPUcnW6leYAqr3Xw34DWLQlja0Ix", "token_type": "Bearer", "expires_in": 3600, "refresh_token": "V2Wlk7aFCnElKlW9BOmRzGhBtqgR2z"}

As you can see, some Identity Manager credentials are required in the payload, in the form of a password-based grant type. This is because the Cosmos Tokens Generator relies on an Identity Manager instance.

[Top](#top)

##<a name="section2"></a>Using the token in Http APIs
This is the case cosmos-proxy has been used to protect any Cosmos Http based resource.

For instance, all the requests sent to the WebHDFS service will be really sent to the proxy, attaching the required `X-Auth-Token` for authentication and authorization purposes:

    $ curl -X GET "http://storage.cosmos.lab.fiware.org:14000/webhdfs/v1/user/frb?op=liststatus&user.name=frb" -H "X-Auth-Token: <mytoken>"
    "FileStatuses":{"FileStatus":[{"pathSuffix":".Trash","type":"DIRECTORY","length":0,"owner":"frb","group":"frb","permission":"700","accessTime":0,"modificationTime":1468519200094,"blockSize":0,"replication":0},{"pathSuffix":...
    
Authentication process is transparent to the user, everything is done at cosmos-proxy.

[Top](#top)

##<a name="section3"></a>Using the token in Hive
Use cosmos-hive-auth-provider to protect HiveServer2 JDBC interface with OAuth2.

In this case, users provide their credentials as usual, but instead of a password they pass a valid OAuth2 token. For instance, if using the Hive clients available in the [resources folder](https://github.com/telefonicaid/fiware-cosmos/tree/master/resources/hiveclients), you can connect this way:

    $ python hiveserver2-client.py computing.cosmos.lab.fiware.org 10000 default frb <mytoken>

Authentication process is transparent to the user, everything is done at cosmos-hive-auth-provider.

[Top](#top)
