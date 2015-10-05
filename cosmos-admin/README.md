#<a name="top"></a>Cosmos - Cosmos Admin

* [What is cosmos-admin](#whatis)
* [`data_copier.sh`](#datacopier)
* [`get_user_stats.sh`](#getuserstats)
* [Reporting issues and contact information](#contact)

##<a name="whatis"></a>What is cosmos-admin
cosmos-admin is a set of tools designed to administrate a Cosmos deployment, both for the Sahara-based and shared Hadoop-based flavours.

Available tools are:

* **data\_copier.sh**: a script designed to copy HDFS data from one cluster to another.
* **get\_user\_stats.sh**: a script designed to get certain user statistics (e.g. HDFS use, last access time) in a periodic fashion (i.e. as script within the crontab).

[Top](#top)

##<a name="datacopier"></a>`data_copier.sh`
This script has been designed for copying HDFS data from one cluster to another. Please observe the data is copied, nod moved, i.e. the source data is never deleted by this script, and this is something up to the source cluster administrator.

The underlying data copying mechanism used by `data_copier.sh` is [WebHDFS](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/WebHDFS.html), the RESTful API from Hadoop for HDFS. This API exposes methods for creating directories, renaming files... and, specially, reading and writting files.

`data_copier.sh` is parameterized by:

* File containing a list of usernames in the source HDFS cluster.
* Source HDFS cluster Http URL.
* Destination HDFS cluster Http URL.
* Maximum number of bytes allowed to be transfered in upload operations by the destination cluster.

In a shell:

    $ ./data_copier.sh <usernames_file> <src_cluster_URL> <dst_cluster_URL> <max_bytes_transfer>

Data is copied user by user, in a sequential way; you'll see logs in the standard output about the current file.

If for any reason the data copying is interrupted (for instance, the communication with any of the clusters breaks down), it is recommended to initiate again the process, starting by the user whose files were partially copied. In more details:

* Delete all the files within the destination cluster related to the affected user.
* Remove all the usernames from the usernames file whose data was successfully copied. The first username in the list must be now the affected user.
* Run the script again.

[Top](#top)

##<a name="getuserstats"></a>`get_user_stats.sh`

This script has been designed to get certain user statistics, these ones:

* Last access time (timestamp format).
* HDFS usage (number of bytes).
* Local file system usage (number of bytes).

The above values are stored within a database usally named `cosmos`,  in a table usually named `cosmos_user`. Follow [this link](../cosmos-gui/README.md#database) for more details about the database.

`get_user_stats.sh` is parameterized by:

* Host running the MySQL server
* Port where the MySQL server listens for requests. Typically, TCP/3306 port.
* Database name. Usually, `cosmos`.
* MySQL user allowd to insert data within the `cosmos` database, `cosmos_user` table.
* Pasword for the MySQL user.

In a shell:

    $ ./get_user_stats.sh <mysql_host> <mysql_port> <db_name> <mysql_user> <mysql_password>

Since the above mentioned statistics change along the time, it is useful to schedule this script execution in a periodic fashion, let's say at least once per day. You can use the `crontab` for achieving this.

[Top](#top)

##<a name="contact"></a>Reporting issues and contact information
There are several channels suited for reporting issues and asking for doubts in general. Each one depends on the nature of the question:

* Use [stackoverflow.com](http://stackoverflow.com) for specific questions about this software. Typically, these will be related to installation problems, errors and bugs. Development questions when forking the code are welcome as well. Use the `fiware-cygnus` tag.
* Use [ask.fiware.org](https://ask.fiware.org/questions/) for general questions about FIWARE, e.g. how many cities are using FIWARE, how can I join the accelarator program, etc. Even for general questions about this software, for instance, use cases or architectures you want to discuss.
* Personal email:
    * [francisco.romerobueno@telefonica.com](mailto:francisco.romerobueno@telefonica.com) **[Main contributor]**
    * [fermin.galanmarquez@telefonica.com](mailto:fermin.galanmarquez@telefonica.com) **[Contributor]**

**NOTE**: Please try to avoid personaly emailing the contributors unless they ask for it. In fact, if you send a private email you will probably receive an automatic response enforcing you to use [stackoverflow.com](stackoverflow.com) or [ask.fiware.org](https://ask.fiware.org/questions/). This is because using the mentioned methods will create a public database of knowledge that can be useful for future users; private email is just private and cannot be shared.

[Top](#top)
