#<a name="top"></a>Cosmos Quick Start Guide
Content:

* [Introduction](#section1)
* [Assumptions](#section2)
* [Step by step guide](#section3)
    * [Step 1: Get an OAuth2 token](#section3.1)
    * [Step 2: Create a Cosmos account](#secton3.2)
    * [Step 3: Upload some data to HDFS](#section3.3)
    * [Step 4: Query your data](#section3.4)
    * [Step 5: Run your first MapReduce job](#section3.5)
    * [Step 6: Download some data](#section3.6)
* [Reporting issues and contact information](#section4)

##<a name="section1"></a>Introduction
This Quick Start Guide overviews the steps a newbie programmer will have to perform in order to get familiar with Cosmos and its functionality. For a more detailed information, please refer to the official [documentation](http://fiware-cosmos.readthedocs.org/en/latest/) and the Cosmos entry in the [FI-WARE Catalogue](http://catalogue.fi-ware.org/enablers/bigdata-analysis-cosmos).

[Top](#top)

##<a name="section2"></a>Assumptions
This Quick Start Guide assumes you are going to use the already deployed Global Instance of Cosmos in FIWARE Lab. This is the <b>recommended usage of Cosmos</b>. This global instance runs in a cluster of machines, providing distributed storage (based on Hadoop Distributed File System - HDFS) and distributed computing capabilities (based on Hadoop MapReduce engine and some querying tools such as Hive).

In fact, the Global Instance of Cosmos in FIWARE Lab is not really a single Hadoop cluster, but one cluster in charge of storage governed by the <i>Storage Endpoint</i> (`storage.cosmos.lab.fiware.org`) and another one in charge of computing governed by the <i>Computing Endpoint</i> (`computing.cosmos.lab.fiware.org`).

[Top](#top)

##<a name="section3"></a>Step by step guide
###<a name="section3.1"></a>Step 1: Get an OAuth2 token
All APIs in FIWARE Lab are protected by means of [OAuth2](http://oauth.net/2/) tokens. Cosmos is not an exception, so you will need to request to the <i>Computing Endpoint</i> a valid token for your FIWARE Lab user. `curl` tool can be used for that purpose:

    $ curl -k -X POST "https://computing.cosmos.lab.fiware.org:13000/cosmos-auth/v1/token" -H "Content-Type: application/x-www-form-urlencoded" -d "grant_type=password&username=<YOUR_USER_EMAIL>&password=<YOUR_PASSWORD>”

Where `username` and `password` are the email and password you used when you registered in FIWARE Lab. You should get something like:

    {"access_token": "3azH09G1PdaGmgBNODLOtxy52f5a00", "token_type": "Bearer", "expires_in": 3600, "refresh_token": "V2Wlk7aFCnElKlW9BOmRzGhBtqgR2z"}

The `access_token` field is the OAuth2 token.

[Top](#top)

###<a name="section3.2"></a>Step 2: Create a Cosmos account
At the moment of writting, deploying a Cosmos Portal for FIWARE Lab is in the roadmap, but not yet done.

Thus, in order to create an account you will have to send an email to `francisco.romerobueno@telefonica.com` specifying your FIWARE Lab ID.

Such an ID can be obtained by querying FIWARE Lab's Identity Manager:

    $ curl -X GET "https://account.lab.fiware.org/user?access_token=<YOUR_OAUTH2_TOKEN>"

The result of such a query for the user `frb` is:

    {"organizations": [], "displayName": "frb", "roles": [{"name": "provider", "id": "106"}], "app_id": “9556cc76154361b3b43d7b31f0600982", "email": "frb@tid.es", "id": "frb”}

The interesting part is the "id" field, in the above example `frb`.

[Top](#top)

###<a name="section3.3"></a>Step 3: Upload some data to HDFS
You can upload your own data to your HDFS space using the WebHDFS RESTful API listening on TCP/14000 port of the <i>Storage Endpoint</i>.

Let's start by creating a new directory (`testdir`) in our HDFS user space (in this example, `hdfs:///user/frb`). `curl` has been used as REST client:

    $ curl -X PUT "http://storage.cosmos.lab.fiware.org:14000/webhdfs/v1/user/frb/testdir?op=MKDIRS&user.name=frb" -H "X-Auth-token: 3azH09G1PdaGmgBNODLOtxy52f5a00" | python -m json.tool
    {"boolean": true}

Now, it is time to upload some local file (`testdata.txt`) to the fresh new directory we have created (please observe the verbose option `-v` has been used):

```
$ cat testdata.txt 
luke,tatooine,jedi,25
leia,alderaan,politician,25
solo,corellia,pilot,32
yoda,dagobah,jedi,275
vader,tatooine,sith,50
```

```
$ curl -v -X PUT -T testdata.txt "http://storage.cosmos.lab.fiware.org:14000/webhdfs/v1/user/frb/testdir/testdata.txt?op=CREATE&user.name=frb" -H "Content-Type: application/octet-stream" -H "X-Auth-token: 3azH09G1PdaGmgBNODLOtxy52f5a00"
*   Trying 195.235.93.174...
* Connected to storage.cosmos.lab.fiware.org (195.235.93.174) port 14000 (#0)
> PUT /webhdfs/v1/user/frb/testdir/testdata.txt?op=CREATE&user.name=frb HTTP/1.1
> Host: storage.cosmos.lab.fiware.org:14000
> User-Agent: curl/7.43.0
> Accept: */*
> Content-Type: application/octet-stream
> X-Auth-token: 3azH09G1PdaGmgBNODLOtxy52f5a00
> Content-Length: 118
> Expect: 100-continue
> 
< HTTP/1.1 100 Continue
* We are completely uploaded and fine
< HTTP/1.1 307 Temporary Redirect
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: HEAD, POST, GET, OPTIONS, DELETE
< Access-Control-Allow-Headers: origin, content-type, X-Auth-Token, Tenant-ID, Authorization
< server: Apache-Coyote/1.1
< set-cookie: hadoop.auth="u=frb&p=frb&t=simple&e=1460661599535&s=Uzn+QdUaqGpZqXsoyNb9cCUuJtU="; Version=1; Path=/; Expires=Thu, 14-Apr-2016 19:19:59 GMT; HttpOnly
< location: http://dev-fiwr-svc-01.tid.es:14000/webhdfs/v1/user/frb/testdir/testdata.txt?op=CREATE&user.name=frb&data=true
< Content-Type: application/json; charset=utf-8
< content-length: 0
< date: Thu, 14 Apr 2016 09:19:59 GMT
< connection: close
< 
* Closing connection 0
```

The above command just has started the uploading operation. As can be seen, the WebHDFS service redirects us to the following location:

    location: http://dev-fiwr-svc-01.tid.es:14000/webhdfs/v1/user/frb/testdir/testdata.txt?op=CREATE&user.name=frb&data=true
    
That's because the first operation only created the new `hdfs:///user/testdir/testdata.txt` HDFS file in the Namenode; not it is time to upload the data bytes to the Datanodes, and that's achieved by PUTting again the local `testdata.txt` file in the redirection URL:

```
$ curl -v -X PUT -T testdata.txt "http://dev-fiwr-svc-01.tid.es:14000/webhdfs/v1/user/frb/testdir/testdata.txt?op=CREATE&user.name=frb&data=true" -H "Content-Type: application/octet-stream" -H "X-Auth-token: 3azH09G1PdaGmgBNODLOtxy52f5a00"
*   Trying 195.235.93.174...
* Connected to storage.cosmos.lab.fiware.org (195.235.93.174) port 14000 (#0)
> PUT /webhdfs/v1/user/frb/testdir/testdata.txt?op=CREATE&user.name=frb&data=true HTTP/1.1
> Host: storage.cosmos.lab.fiware.org:14000
> User-Agent: curl/7.43.0
> Accept: */*
> Content-Type: application/octet-stream
> X-Auth-token: 3azH09G1PdaGmgBNODLOtxy52f5a00
> Content-Length: 118
> Expect: 100-continue
> 
< HTTP/1.1 100 Continue
* We are completely uploaded and fine
< HTTP/1.1 201 Created
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: HEAD, POST, GET, OPTIONS, DELETE
< Access-Control-Allow-Headers: origin, content-type, X-Auth-Token, Tenant-ID, Authorization
< server: Apache-Coyote/1.1
< set-cookie: hadoop.auth="u=frb&p=frb&t=simple&e=1460661759278&s=w59VlQYJNAoJ1iECqXrWOIXN9hQ="; Version=1; Path=/; Expires=Thu, 14-Apr-2016 19:22:39 GMT; HttpOnly
< Content-Type: application/json; charset=utf-8
< content-length: 0
< date: Thu, 14 Apr 2016 09:22:39 GMT
< connection: close
< 
* Closing connection 0
```

We can check the data has been successfully uploaded:

```
$ curl -X GET "http://storage.cosmos.lab.fiware.org:14000/webhdfs/v1/user/frb/testdir/testdata.txt?op=OPEN&user.name=frb" -H "X-Auth-token: 3azH09G1PdaGmgBNODLOtxy52f5a00"
luke,tatooine,jedi,25
leia,alderaan,politician,25
solo,corellia,pilot,32
yoda,dagobah,jedi,275
vader,tatooine,sith,50
```
    
NOTES:

* `dev-fiwr-svc-01.tid.es` is just an alias of `storage.cosmos.lab.fiware.org`.
* You can get more details on the 2-step uploading operation in the [WebHDFS specification](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/WebHDFS.html).
* The Global Instance of Cosmos in FIWARE Lab runs the [HttpFS gateway](http://hadoop.apache.org/docs/current/hadoop-hdfs-httpfs/index.html). That's why the REST operations are done against the TCP/14000 port and not the against the TCP/50070 port used by WebHDFS (which is not exposed). That's also the reason the redirection locations point to the HttpFS server itself instead of to the real Datanode.

[Top](#top)

###<a name="section3.4"></a>Step 4: Query your data
Coming soon.

[Top](#top)

###<a name="section3.5"></a>Step 5: Run your first MapReduce job
Several already developed MapReduce examples can be found in every Hadoop distribution, typically in a Java `.jar` file called `hadoop-mapreduce-examples.jar`. This file is copied to the HDFS space a user owns in FIWARE Lab, specifically under the `jars/` folder, so the `frb` user should have it copied to:

    hdfs:///user/frb/jars/hadoop-mapreduce-examples.jar

Thus, you can run the <i>Word Count</i> example (this is also know as the "hello world" of Hadoop) by typing:

    $ curl -X POST "http://computing.cosmos.lab.fiware.org:12000/tidoop/v1/user/frb/jobs" -d '{"jar":"jars/hadoop-mapreduce-examples.jar","class_name":"wordcount","lib_jars":"jars/hadoop-mapreduce-examples.jar","input":"testdir","output":"testoutput"}' -H "Content-Type: application/json" -H "X-Auth-Token: 3azH09G1PdaGmgBNODLOtxy52f5a00"
    {"success":"true","job_id": "job_1460639183882_0001"}

As you can see, another REST API has been used, in this case the Tidoop REST API in the <i>Computing Endpoint</i>. The API allows you checking the status of the job as well:

    $ curl -X GET "http://computing.cosmos.lab.fiware.org:12000/tidoop/v1/user/frb/jobs/job_1460639183882_0001" -H "X-Auth-Token: 3azH09G1PdaGmgBNODLOtxy52f5a00"
    {"success":"true","job":{"job_id":"job_1460639183882_0001","state":"SUCCEEDED","start_time":"1461060258427","user_id":"frb"}}

[Top](#top)

###<a name="section3.6"></a>Step 6: Download some data
Finally, the result of the MapReduce execution can be seen at the output HDFS folder (which is automatically created) by using the WebHDFS REST API in the <i>Storage Endpoint</i>:

    $ curl -X GET "http://storage.cosmos.lab.fiware.org:14000/webhdfs/v1/user/frb/testoutput?op=liststatus&user.name=frb" -H "X-Auth-Token: 3azH09G1PdaGmgBNODLOtxy52f5a00"
    {"FileStatuses":{"FileStatus":[{"pathSuffix":"_SUCCESS","type":"FILE","length":0,"owner":"frb","group":"frb","permission":"644","accessTime":1461060272601,"modificationTime":1461060272616,"blockSize":134217728,"replication":3},{"pathSuffix":"part-r-00000","type":"FILE","length":47,"owner":"frb","group":"frb","permission":"644","accessTime":1461060272228,"modificationTime":1461060272409,"blockSize":134217728,"replication":3}]}}
    $ curl -X GET "http://storage.cosmos.lab.fiware.org:14000/webhdfs/v1/user/frb/testoutput/part-r-00000?op=open&user.name=frb" -o output.txt -H "X-Auth-Token: 3azH09G1PdaGmgBNODLOtxy52f5a00"
    $ cat output.txt 
    leia,alderaan,politician,25	1
    luke,tatooine,jedi,25	1
    solo,corellia,pilot,32	1
    vader,tatooine,sith,50	1
    yoda,dagobah,jedi,275	1
    
[Top](#top)

##<a name="section4"></a>Reporting issues and contact information
There are several channels suited for reporting issues and asking for doubts in general. Each one depends on the nature of the question:

* Use [stackoverflow.com](http://stackoverflow.com) for specific questions about this software. Typically, these will be related to installation problems, errors and bugs. Development questions when forking the code are welcome as well. Use the `fiware-cygnus` tag.
* Use [ask.fiware.org](https://ask.fiware.org/questions/) for general questions about FIWARE, e.g. how many cities are using FIWARE, how can I join the accelarator program, etc. Even for general questions about this software, for instance, use cases or architectures you want to discuss.
* Personal email:
    * [francisco.romerobueno@telefonica.com](mailto:francisco.romerobueno@telefonica.com) **[Main contributor]**
    * [pablo.coellovillalba@telefonica.com](mailto:pablo.coellovillalba@telefonica.com) **[Contributor]**

**NOTE**: Please try to avoid personaly emailing the contributors unless they ask for it. In fact, if you send a private email you will probably receive an automatic response enforcing you to use [stackoverflow.com](stackoverflow.com) or [ask.fiware.org](https://ask.fiware.org/questions/). This is because using the mentioned methods will create a public database of knowledge that can be useful for future users; private email is just private and cannot be shared.

[Top](#top)