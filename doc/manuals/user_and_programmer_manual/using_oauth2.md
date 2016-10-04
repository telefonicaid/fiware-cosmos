#<a name="top"></a>OAuth2 in Cosmos APIs
Content:

* [Requesting a token](#section1)
* [Using the token](#section2)

##<a name="section1"></a>Requestig a token
Before using any REST API protected by [OAuth2](http://oauth.net/2/), you must request a token to the Cosmos Tokens Generator you must have installed somewhere. This is a service that will be listening in TCP/13000 port (in FIWARE Lab, this is `computing.cosmos.lab.fiware.org:13000`. You can do this using any REST client of your choice, the easiest way is using the `curl` command:

    $ curl -k -X POST "https://<tokens_generator_host>:13000/cosmos-auth/v1/token" -H "Content-Type: application/x-www-form-urlencoded" -d "grant_type=password&username=<registered_email_in_imd>&password=<password_in_idm>"
    {"access_token": "qjHPUcnW6leYAqr3Xw34DWLQlja0Ix", "token_type": "Bearer", "expires_in": 3600, "refresh_token": "V2Wlk7aFCnElKlW9BOmRzGhBtqgR2z"}

As you can see, some Identity Manager credentials are required in the payload, in the form of a password-based grant type. This is because the Cosmos Tokens Generator relies on an Identity Manager instance.

[Top](#top)

##<a name="section2"></a>Using the token
Use cosmos-proxy to protect any Cosmos Http based resource.

For instance, if aiming to protect WebHDFS simply re-configure the service for running in an alternative port different than the default one, e.g. TCP/41000 instead or TCP/14000. Then, configure the proxy for listening in the original WebHDFS port, i.e. TCP/14000 and specify the new target port, i.e. TCP/41000. From here on, all the requests sent to the WebHDFS service will be really sent to the proxy, attaching the required `X-Auth-Token` for authentication and authorization purposes:

    $ curl -X GET "http://storage.cosmos.lab.fiware.org:14000/webhdfs/v1/user/frb?op=liststatus&user.name=frb" -H "X-Auth-Token: mytoken"
    "FileStatuses":{"FileStatus":[{"pathSuffix":".Trash","type":"DIRECTORY","length":0,"owner":"frb","group":"frb","permission":"700","accessTime":0,"modificationTime":1468519200094,"blockSize":0,"replication":0},{"pathSuffix":...

You may have a look on the proxy and see how authentication and authorization has been done:

    {"level":"info","message":"Authentication OK: {\"organizations\": [], \"displayName\": \"frb\", \"roles\": [{\"name\": \"provider\", \"id\": \"106\"}], \"app_id\": \"4d1af2eec3754099a4f8dc86bf735068\", \"email\": \"frb@tid.es\", \"id\": \"frb\"}","timestamp":"2016-07-14T11:48:15.332Z"}
    {"level":"info","message":"Authorization OK: user frb is allowed to access /webhdfs/v1/user/frb","timestamp":"2016-07-14T11:48:15.332Z"}
    {"level":"info","message":"Redirecting to http://0.0.0.0:41000","timestamp":"2016-07-14T11:48:15.332Z"}

[Top](#top)
