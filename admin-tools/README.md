#<a name="top"></a>Cosmos - Cosmos Admin

* [What is cosmos-admin](#whatis)
* [`data_copier.sh`](#datacopier)
* [Contact](#contact)

##<a name="whatis"></a>What is cosmos-admin
cosmos-admin is a set of tools designed to administrate a Cosmos deployment, both for the Sahara-based and shared Hadoop-based flavours.

Available tools are:

* **data_copier.sh**: a script designed to copy HDFS data from one cluster to another.

[Top](#top)

##<a name="datacopier"></a>`data_copier.sh`
This script has been designed for copying HDFS data from one cluster to another. Please observe the data is copied, nod moved, i.e. the source data is never deleted by this script, and this is something up to the source cluster administrator.

The underlying data copying mechanism used by `data_copier.sh` is [WebHDFS](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/WebHDFS.html), the RESTful API from Hadoop for HDFS. This API exposes methods for creating directories, renaming files... and, specially, reading and writting files.

`data_copier.sh` is parameterized by:

* File containing a list of usernames in the source HDFS cluster.
* Source HDFS cluster Http URL.
* Destination HDFS cluster Http URL.
* Maximum number of bytes allowed to be transfered in upload operations by the destination cluster.

Data is copied user by user, in a sequential way; you'll see logs in the standard output about the current file.

If for any reason the data copying is interrupted (for instance, the communication with any of the clusters breaks down), it is recommended to initiate again the process, starting by the user whose files were partially copied. In more details:

* Delete all the files within the destination cluster related to the affected user.
* Remove all the usernames from the usernames file whose data was successfully copied. The first username in the list must be now the affected user.
* Run the script again.

[Top](#top)

##Contact
Francisco Romero Bueno (francisco dot romerobueno at telefonica dot com) **[Main contributor]**
<br>
Fermín Galán Márquez (fermin dot galanmarquez at telefonica dot com) **[Contributor]**

[Top](#top)
