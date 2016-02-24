#<a name="top"></a>Cosmos Quick Start Guide
Content:

* [Introduction](#section1)
* [Assumptions](#section2)
* [Five-step guide](#section3)
    * [Step 1: Create a Cosmos account](#section3.1)
    * [Step 2: Upload some data to HDFS](#secton3.2)
    * [Step 3: Query your data](#section3.3)
    * [Step 4: Run your first MapReduce job](#section3.4)
    * [Step 5: Download some data](#section3.5)
* [Reporting issues and contact information](#section4)

##<a name="section1"></a>Introduction
This Quick Start Guide overviews the steps a newbie programmer will have to perform in order to get familiar with Cosmos and its functionality. For a more detailed information, please refer to the official [documentation](http://fiware-cosmos.readthedocs.org/en/latest/) and the Cosmos entry in the [FI-WARE Catalogue](http://catalogue.fi-ware.org/enablers/bigdata-analysis-cosmos).

[Top](#top)

##<a name="section2"></a>Assumptions
This Quick Start Guide assumes you are going to use the already deployed Global Instance of Cosmos in FIWARE Lab. This is the <b>recommended usage of Cosmos</b>. This global instance runs in a cluster of machines, providing distributed storage (based on Hadoop Distributed File System - HDFS) and distributed computing capabilities (based on Hadoop MapReduce engine and some querying tools such as Hive). The entire cluster is governed by a Head Node reachable at `cosmos.lab.fi-ware.org`.

[Top](#top)

##<a name="section3"></a>Five-step guide
###<a name="section3.1"></a>Step 1: Create a Cosmos account
Browse the [Cosmos portal](http://cosmos.lab.fi-ware.org). Use an already registered user in FIWARE Lab to create a Cosmos account. The details of your account will be given once registered, typically:

* Cosmos username: If your FIWARE Lab username is <i>my\_user@mailprovider.com</i>, then your Cosmos username will be <i><b>my\_user</b></i>. This will give you a Unix-like account in the Head Node of the global instance, being your user space <code>/home/<my_user>/</code>.
* Cosmos password: As part of the registration process, a password must be provided for `ssh` purposes.
* Cosmos HDFS space: Apart from your Unix-like user space in the Head Node, you will have a HDFS space located at the entire cluster, it will be <b>`/user/<my_user>/`</b>

Now you should be ready to login into the Head Node of the global instance of Cosmos in FIWARE Lab:

    $ ssh my_user@cosmos.lab.fi-ware.org

Once logged, you can have access to your HDFS space by using the [Hadoop File System Shell](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/FileSystemShell.html) commands:

    $ hadoop fs -ls /user/my_user // lists your HDFS space
    $ hadoop fs -mkdir /user/my_user/new_folder // creates a new directory called "new_folder" under your HDFS space
    $ ...

[Top](#top)

###<a name="section3.2"></a>Step 2: Upload some data to HDFS
You can upload your own data to your HDFS space using the Hadoop File System Shell commands. This can be only done after loging into the Head Node, and allows uploading Unix-like local files placed in the Head node:

     $ echo "long time ago, in a galaxy far far away..." > unstructured_data.txt
     $ hadoop fs -mkdir /user/my_user/input/unstructured/
     $ hadoop fs -put unstructured_data.txt /user/my_user/input/unstructured/

However, using the WebHDFS/HttpFS RESTful API will allow you to upload files existing outside the global instance of Cosmos in FIWARE Lab. The following example uses HttpFS instead of WebHDFS (uses the TCP/14000 port instead of TCP/50070), and `curl` is used as HTTP client (but your applications should implement your own HTTP client):

    $ curl -i -X PUT "http://cosmos.lab.fi-ware.org:14000/webhdfs/v1/user/my_user/input_data?op=MKDIRS&user.name=my_user"
    $ curl -i -X PUT "http://cosmos.lab.fi-ware.org:14000/webhdfs/v1/user/my_user/input_data/unstructured_data.txt?op=CREATE&user.name=my_user"
    $ curl -i -X PUT -T unstructured_data.txt --header "content-type: application/octet-stream" http://cosmos.lab.fi-ware.org:14000/webhdfs/v1/user/my_user/input_data/unstructured_data.txt?op=CREATE&user.name=my_user&data=true

As you can see, the data uploading is a two-step operation, as stated in the [WebHDFS specification](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/WebHDFS.html). The first invocation of the API talks directly with the Head Node, specifying the new file creation and its name; then the Head Node sends a temporary redirection response, specifying the Data Node among all the existing ones in the cluster where the data has to be stored, which is the endpoint of the second step. Nevertheless, the [HttpFS gateway](http://hadoop.apache.org/docs/current/hadoop-hdfs-httpfs/index.html) implements the same API but its internal behaviour changes, making the redirection to point to the Head Node itself.

[Top](#top)

###<a name="section3.3"></a>Step 3: Query your data
If the data you have uploaded to your HDFS space is a CSV-like file, i.e. a structured file containing lines of data fields separated by a common character, then you can use [Hive](http://hive.apache.org/) to query the data:

    $ echo "luke,tatooine,jedi,25" >> structured_data.txt
    $ echo "leia,alderaan,politician,25" >> structured_data.txt
    $ echo "solo,corellia,pilot,32" >> structured_data.txt
    $ echo "yoda,dagobah,jedi,275" >> structured_data.txt
    $ echo "vader,tatooine,sith,50" >> structured_data.txt
    $ hadoop fs -mkdir /user/my_user/input/structured/
    $ hadoop fs -put structured_data.txt /user/my_user/input/structured/

A Hive table can be created, which is like a SQL table. Log into the Head Node, invoke the Hive CLI and type the following in order to create a Hive table:

    $ hive
    hive> create external table my_user_star_wars (name string, planet string, profession string, age int) row format delimited fields terminated by ',' location '/user/my_user/input/structured/';

These Hive tables can be queried locally, by using the Hive CLI as well:

    $ hive
    hive> select * from <my_user>_star_wars;

Or any other SQL-like sentence, properly called [HiveQL ](http://cwiki.apache.org/confluence/display/Hive/LanguageManual)

Or remotelly, by [developing a Hive client](http://github.com/telefonicaid/fiware-connectors/tree/develop/resources/hive-basic-client) (typically, using JDBC, but there are some other options for other non Java programming languages) able to connect to `cosmos.lab.fi-ware.org:10000`.

[Top](#top)

###<a name="section3.4"></a>Step 4: Run your first MapReduce job
Several pre-loaded MapReduce examples can be found in every Hadoop distribution. You can list them by ssh'ing the Head Node and commanding Hadoop:

    $ hadoop jar /usr/lib/hadoop-0.20/hadoop-examples.jar

For instance, you can run the word count example (this is also know as the "hello world" of Hadoop) by typing:

    $ hadoop jar /usr/lib/hadoop-0.20/hadoop-examples.jar wordcount /user/my_user/input/unstructured/unstructured_data.txt /user/my_user/output/

Please observe the output HDFS folder is automatically created.

The MapReduce results are stored in HDFS. You can download them to your Unix user space within the Head Node by doing:

    $ hadoop fs -getmerge /user/my_user/output /home/my_user/count_result.txt
  
[Top](#top)

###<a name="section3.5"></a>Step 5: Download some data
You can download any HDFS file to you home user in the Head Node by doing:

    $ hadoop fs -get /user/my_user/structured/structured_data.txt /home/my_user/

If you want to donwload the HDFS file directly to a remote machine, you must use the WebHDFS/HttpFS RESTful API:

    $ curl -i -L "http://cosmos.lab.fi-ware.org:14000/webhdfs/v1/user/my_user/structured/structured_data.txt?op=OPEN&user.name=my_user"

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