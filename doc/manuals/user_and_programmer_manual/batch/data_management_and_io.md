#<a name="top"></a>Data management and I/O

Content:<br>

* [Introduction](#section1)
* [File System Shell](#section2)
* [WebHDFS](#section3)
* [HttpFS](#section4)
* [Feeding HDFS with Cygnus](#section5)

##<a name="section1"></a>Introduction
The storage cluster is used for I/O of data. Each Cosmos user will own a HDFS space (limited by quota) where to upload big data for future analysis, or from where to download analysis results. Such a userspace can be managed as any Unix-like file system, i.e. directories and files with ownership and permissions can be created, deleted, renamed or moved.

[Top](#top)

##<a name="section2"></a>File System Shell

If you are enabled to ssh into the storage cluster, you will be able to manage your big data directly form the command line. There exists a complete suite of commands for HDFS named File System Shell allowing you to perform any Unix-like operation. Please refer to the [official documentation](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/FileSystemShell.html) for full details on the available commands.

Let's assume I want to save certain local files under a new HDFS folder. Once logged in the Services Node of the storage cluster, I may start using the `hadoop fs` command.

First of all, I may list the content of my root HDFS userspace (which matches my Unix username) in order to check there is no directory with the desired name:

    $ hadoop fs -ls /user/myuserspace
    Found 1 items
    drwxr-----   - myuserspace myuserspace   0 2015-07-09 12:04 /user/frb/.staging

Please observe the result is the same if no path is given; this is because the File System Shell gets the HDFS userspace name from the Unix username currently logged:

    $ hadoop fs -ls
    Found 1 items
    drwxr-----   - myuserspace myuserspace   0 2015-07-09 12:04 /user/myuserspace/.staging

Now, I can create the folder:

    $ hadoop fs -mkdir /user/myuserspace/myfolder

It is the time to upload the files:

    $ hadoop fs -put *.txt /user/myuserspace/myfolder

Let's check my root userspace, the new folder must appear:

    $ hadoop fs -ls /user/myuserspace
    $ hadoop fs -ls
    Found 2 items
    drwxr-----   - myuserspace myuserspace   0 2015-07-09 12:04 /user/myuserspace/.staging
    drwxr-xr-x   - myuserspace myuserspace   0 2015-08-10 11:05 /user/myuserspace/myfolder

Do the same with the content of the new folder:

    $ hadoop fs -ls /user/myuserspace/myfolder
    Found 2 items
    -rw-r--r--   3 myuserspace myuserspace   1234   2015-08-10 11:05 /user/myuserspace/myfolder/mydatafile1.txt
    -rw-r--r--   3 myuserspace myuserspace   475688 2015-08-10 11:05 /user/myuserspace/myfolder/mydatafile2.txt

Finally, we can list the content of one of the uploaded files:

    $ hadoop fs -cat /user/myuserspace/myfolder/mydatafile1.txt`\
    Lorem ipsum ad his scripta blandit partiendo, eum fastidii accumsan euripidis in, eum liber hendrerit an. Qui ut wisi vocibus suscipiantur, quo dicit ridens inciderint id. Quo mundi lobortis reformidans eu, legimus senserit definiebas an eos. Eu sit tincidunt incorrupte definitionem, vis mutat affert percipit cu, eirmod consectetuer signiferumque eu per. In usu latine equidem dolores. Quo no falli viris intellegam, ut fugit veritus placerat per.

As said, the following sequence of sentences will produce the same result:

    $ hadoop fs -ls
    $ hadoop fs -mkdir myfolder
    $ hadoop fs -put *.txt myfolder
    $ hadoop fs -ls
    $ hadoop fs -ls myfolder
    $ hadoop fs -cat myfolder/mydatafile1.txt

[Top](#top)

##<a name="section3"></a>WebHDFS

WebHDFS is the API for applications aiming to do remote I/O of data. It is a REST API containing all the operation within the File System Shell, thus any standard REST client library available for any programming language will be able to interact with HDFS. Please refer to the [official documentation](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/WebHDFS.html) for full details on the API.

Observations:

* WebHDFS needs all the nodes of the cluster are accessible by IP address of FQDN. This is because the writing operations are two-step requests, being the first request sent to the namenode informing a new file is going to be created (or new data is going to be appended to an already existent file), and the second one to the node appearing in the location redirection header within the response to first request. If you cannot ensure all the nodes are accessible by IP address or FQDN, please consider using [HttpFS](#section4).
* This REST API may be protected with [OAuth2](http://oauth.net/2/); check how to use such a protected API in the [OAuth2-protected REST APIs usage](#section5) section.

Let's assume I want to save certain local files under a new HDFS folder. The sequence of operations performed through the REST API will be (using `[http://curl.haxx.se/ curl]` as a command-line REST client, but any other REST client could be used; using `python -m json.tool` just for pretty printing purposes):

First of all, I may list the content of my root HDFS userspace (which matches my Unix username) in order to check there is no directory with the desired name:

    $ curl -X GET "http://<services_node>:50070/webhdfs/v1/user/myuserspace?op=liststatus&user.name=myuserspace" | python -m json.tool
    {
        "FileStatuses": {
            "FileStatus": [
                {
                    "accessTime": 0,
                    "blockSize": 0,
                    "group": "myuserspace",
                    "length": 0,
                    "modificationTime": 1436436292075,
                    "owner": "myuserspace",
                    "pathSuffix": ".staging",
                    "permission": "740",
                    "replication": 0,
                    "type": "DIRECTORY"
                }
            ]
        }
    }

Now, I can create the folder:

    $ curl -X PUT "http://<services_node>:50070/webhdfs/v1/user/myuserspace/myfolder?op=mkdirs&user.name=myuserspace" | python -m json.tool
    {
        "boolean": true
    }

It is the time to upload the files:

    $ curl -L -X PUT "http://<services_node>:50070/webhdfs/v1/user/myuserspace/myfolder/mydatafile1.txt?op=create&user.name=myuserspace" -H "X-Auth-Token: QfS3FSluzvDKNg2ZyiJ1T9K9fmh73u" -H "Content-Type: application/octet-stream" -d@./mydatafile1.txt
    $ curl -L -X PUT "http://<services_node>:50070/webhdfs/v1/user/myuserspace/myfolder/mydatafile2.txt?op=create&user.name=myuserspace" -H "X-Auth-Token: QfS3FSluzvDKNg2ZyiJ1T9K9fmh73u" -H "Content-Type: application/octet-stream" -d@./mydatafile2.txt

Please observe in this case the `*` wildcard cannot be used and the files must be uploaded one by one. Please observe as well the usage of the option `-L`, it is used to follow the redirection returned by the server (creating a HDFS file is a two-step operation in WebHDFS, check the [documentation](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Create_and_Write_to_a_File)).

Let's check my root userspace, the new folder must appear:

    $ curl -X GET "http://<services_node>:50070/webhdfs/v1/user/myuserspace?op=liststatus&user.name=myuserspace" | python -m json.tool
    {
        "FileStatuses": {
            "FileStatus": [
                {
                    "accessTime": 0,
                    "blockSize": 0,
                    "group": "myuserspace",
                    "length": 0,
                    "modificationTime": 1436436292075,
                    "owner": "myuserspace",
                    "pathSuffix": ".staging",
                    "permission": "740",
                    "replication": 0,
                    "type": "DIRECTORY"
                },
                {
                    "accessTime": 0,
                    "blockSize": 0,
                    "group": "myuserspace",
                    "length": 0,
                    "modificationTime": 1439199172915,
                    "owner": "myuserspace",
                    "pathSuffix": "myfolder",
                    "permission": "755",
                    "replication": 0,
                    "type": "DIRECTORY"
                }
            ]
        }
    }

Do the same with the content of the new folder:

    $ curl -X GET "http://<services_node>:50070/webhdfs/v1/user/myuserspace/myfolder?op=liststatus&user.name=myuserspace" | python -m json.tool
    {
        "FileStatuses": {
            "FileStatus": [
                {
                    "accessTime": 1439197513371,
                    "blockSize": 67108864,
                    "group": "myuserspace",
                    "length": 1234,
                    "modificationTime": 1439197513446,
                    "owner": "myuserspace",
                    "pathSuffix": "mydatafile1.txt",
                    "permission": "644",
                    "replication": 3,
                    "type": "FILE"
                },
                {
                    "accessTime": 1439197513371,
                    "blockSize": 67108864,
                    "group": "myuserspace",
                    "length": 475688,
                    "modificationTime": 1439197513446,
                    "owner": "myuserspace",
                    "pathSuffix": "mydatafile2.txt",
                    "permission": "644",
                    "replication": 3,
                    "type": "FILE"
                }
            ]
        }
    }

Finally, we can list the content of one of the uploaded files:

    $ curl -X GET "http://<services_node>:50070/webhdfs/v1/user/myuserspace/myfolder/mydatafile1.txt?op=open&user.name=myuserspace"
     Lorem ipsum ad his scripta blandit partiendo, eum fastidii accumsan euripidis in, eum liber hendrerit an. Qui ut wisi vocibus suscipiantur, quo dicit ridens inciderint id. Quo mundi lobortis reformidans eu, legimus senserit definiebas an eos. Eu sit tincidunt incorrupte definitionem, vis mutat affert percipit cu, eirmod consectetuer signiferumque eu per. In usu latine equidem dolores. Quo no falli viris intellegam, ut fugit veritus placerat per.

[Top](#top)

##<a name="section4"></a>HttpFS

HttpFS in an alternative implementation of the WebHDFS REST API. Specifically, the redirection locations in the two-step request
operations point to the same HttpFS server you sent the first request; internally, the server knows which is the real datanode the second request must be sent, this is why HttpFS is said to be a gateway.

Observations:

* HttpFS REST API is 100% equals to the WebHDFS one, the only changes are the IP address/FQDN of the HttpFS server, that may be different than the Namenode IP address/FQDN (it depends on the specific deployment), and the TCP port (14000 instead of 50070 used by WebHDFS).
* This REST API may be protected with [OAuth2](http://oauth.net/2/); check how to use such a protected API in the [OAuth2-protected REST APIs usage](#section5) section.

[Top](#top)

##<a name="section5"></a>Feeding HDFS with Cygnus

Once installed and configured, Cygnus works as a connector between [Orion Context Broker](http://catalogue.fiware.org/enablers/publishsubscribe-context-broker-orion-context-broker) and multiple storage backends, HDFS among them, automatically moving NGSI-like context data from one to the other in order to build a historic view of such a data. Within the NGSI model, every concept, object or thing is translated into an *entity*, and its properties are modeled as *attributes*. Since Orion Context Broker is designed to handle just the last value for each entity's attribute, it is necessary a tool like Cygnus in order to create a list of attribute values all along the time.

In the case of our permanent storage, which is based in HDFS, Cygnus is an excellent tool for feeding the enabler with valuable (big) data from the Internet of Things. All the details about how to persist context data in HDFS can be found in the [README](http://github.com/telefonicaid/fiware-cygnus/blob/master/README.md) of Cygnus at Github, and more specifically in the [OrionHDFSSink](http://github.com/telefonicaid/fiware-cygnus/blob/master/doc/design/OrionMySQLSink.md) class documentation; however, we could say a generic Cygnus configuration for HDFS could be:

* A Http source in charge of receiving NGSI-like notifications.
* A memory channel with capacity for, let's say, 1000 events.
* A OrionHDFSSink properly configured to write the data in the permanent storage, which is HDFS based.

Once the above configuration is done, nothing has to be done with Cygnus in terms of usage or programming. It will automatically start persisting the notified context data in HDFS files; the mapping between the NGSI-like notified data and the HDFS files is described [here](http://github.com/telefonicaid/fiware-cygnus/blob/master/doc/design/OrionMySQLSink.md#mapping-flume-events-to-hdfs-data-structures), but unless the advanced [grouping](http://github.com/telefonicaid/fiware-cygnus/blob/master/doc/design/interceptors.md#groupinginterceptor-interceptor) feature is used, a per-entity HDFS file is created in a path that depends on the [FIWARE Service](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/Publish/Subscribe_Broker_-_Orion_Context_Broker_-_User_and_Programmers_Guide#Multi_service_tenancy) and [FIWARE Service Path](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/Publish/Subscribe_Broker_-_Orion_Context_Broker_-_User_and_Programmers_Guide#Entity_service_paths) the entity belongs to, and the entity identifier and type itself.

The HDFS files created and fed by Cygnus are regular HDFS files (with an internal data representation in JSON format) that can be queried through Hive (a JSON serialized-deserializer is needed) and processed with custom NGSI-like MapReduce applications.

[Top](#top)
