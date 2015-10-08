#<a name="top"></a>Cosmos - Cosmos Admin

* [What is cosmos-admin](#whatis)
* [`data_copier.sh`](#datacopier)
* [`warnings.sh`](#warnings)
* [Reporting issues and contact informatio](#contact)

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

###<a name="warnings"></a>`warnings.sh`
This script has been designed for detecting certain scenarios the Cosmos administrator must be warned about. Specifically:

* When a HDFS space is close to the quota limit. How much close it is depends on a configurable threshold.
* When an account has no data within the HDFS space and certain time has last after the account creation. The interval check depends on a configurable value measured in days.

When any of the above situations is detected, an email is sent to the Cosmos administrator.

`warnings.sh` is parameterized by:

*  Host running the MySQL server
* Port where the MySQL server listens for requests. Typically, TCP/3306 port.
* Database name. Usually, `cosmos`.
* MySQL user allowed to insert data within the `cosmos` database, `cosmos_user` table.
* Pasword for the MySQL user.
* Percentage of HDFS space considered close to the quota limit.
* Number of days since creation an account having no HDFS data is considered unused.
* Email address (owned by an administrator) which sending the report to.
* Title for the report.

It is convenient this script is run with a frequency not greater than a day, since the warnings may result in a critical scenario (e.g. insufficient storage space for a user).

[Top](#top)

##<a name="contact"></a>Reporting issues and contact information
There are several channels suited for reporting issues and asking for doubts in general. Each one depends on the nature of the question:

* Use [stackoverflow.com](http://stackoverflow.com) for specific questions about the software. Typically, these will be related to installation problems, errors and bugs. Development questions when forking the code are welcome as well. Use the `fiware-cosmos` tag.
* Use [fiware-tech-help@lists.fi-ware.org](mailto:fiware-tech-help@lists.fi-ware.org) for general questions about the software. Typically, these will be related to the conceptual usage of the component, e.g. wether it suites for your project or not. It is worth to mention the issues reported to [fiware-tech-help@lists.fi-ware.org](mailto:fiware-tech-help@lists.fi-ware.org) are tracked under [http://jira.fiware.org](http://jira.fiware.org); use this Jira to see the status of the issue, who has been assigneed to, the exchanged emails, etc, nevertheless the answers will be sent to you via email too.
* Personal email:
    * [francisco.romerobueno@telefonica.com](mailto:francisco.romerobueno@telefonica.com) **[Main contributor]**
    * [fermin.galanmarquez@telefonica.com](mailto:fermin.galanmarquez@telefonica.com) **[Contributor]**

**NOTE**: Please try to avoid personaly emailing the contributors unless they ask for it. In fact, if you send a private email you will probably receive an automatic response enforcing you to use [stackoverflow.com](stackoverflow.com) or [fiware-tech-help@lists.fi-ware.org](mailto:fiware-tech-help@lists.fi-ware.org). This is because using the mentioned methods will create a public database of knowledge that can be useful for future users; private email is just private and cannot be shared.

[Top](#top)
