#<a name="top"></a>OAuth2-protected REST APIs usage

Content:<br>

* [Requesting an OAuth2 token](#section1)
* [Using the token with WebHDFS](#section2)

##<a name="section1"></a>Requesting an OAuth2 token

Before using any REST API protected by [OAuth2](http://oauth.net/2/), you must request a token to the Cosmos Tokens Generator you must have installed somewhere. This is a service that will be listening in TCP/13000 port (in FIWARE Lab, this is `cosmos.lab.fiware.org:13000`. You can do this using any REST client of your choice, the easiest way is using the `curl` command:

    $ curl -k -X POST "https://<tokens_generator_host>:13000/cosmos-auth/v1/token" -H "Content-Type: application/x-www-form-urlencoded" -d "grant_type=password&username=<registered_email_in_imd>&password=<password_in_idm>"
     {"access_token": "qjHPUcnW6leYAqr3Xw34DWLQlja0Ix", "token_type": "Bearer", "expires_in": 3600, "refresh_token": "V2Wlk7aFCnElKlW9BOmRzGhBtqgR2z"}

As you can see, some Identity Manager credentials are required in the payload, in the form of a password-based grant type. This is because the Cosmos Tokens Generator relies on an Identity Manager instance.

[Top](#top)

##<a name="section2"></a>Using the token with WebHDFS

Once the access token is got (in the example above, it is `qjHPUcnW6leYAqr3Xw34DWLQlja0Ix`), simply add it to the original WebHDFS request by using the \`X-Auth-Token\` header:

    $ curl -X GET "http://<namenode_or_httpfs_host>:<50070_or_14000>/webhdfs/v1/user/<your_cosmos_username>/path/to/the/data?op=liststatus&user.name=<your_cosmos_username>" -H "X-Auth-Token: qjHPUcnW6leYAqr3Xw34DWLQlja0Ix"
    {"FileStatuses":{"FileStatus":[...]}}

If you try the above request with a random token the server will return the token is not valid; that's because you have <b>not authenticated properly</b>:

    $ curl -X GET "http://<namenode_or_httpfs_host>:<50070_or_14000>/webhdfs/v1/user/<your_cosmos_username>/path/to/the/data?op=liststatus&user.name=<your_cosmos_username>" -H "X-Auth-Token: randomtoken93487345"
    User token not authorized

The same way, if using a valid token but trying to access another HDFS userspace, you will get the same answer; that's because you are <b>not authorized</b> to access any HDFS userspace but the one owned by you:

    $ curl -X GET "http://<namenode_or_httpfs_host>:<50070_or_14000>/webhdfs/v1/user/<other_cosmos_username>/path/to/the/data?op=liststatus&user.name=<other_cosmos_username>" -H "X-Auth-Token: qjHPUcnW6leYAqr3Xw34DWLQlja0Ix"
    User token not authorized

[Top](#top)
