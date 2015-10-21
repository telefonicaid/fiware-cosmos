#<a name="top"></a>Cosmos - Cosmos Admin

* [What is cosmos-admin](#whatis)
* [Scripts](#scripts)
    * [`data_copier.sh`](#datacopier)
    * [`get_user_stats.sh`](#getuserstats)
* [OS programming regarding the administrative scripts](#osprogramming)
    * [Crontab](#crontab)
    * [Log rotation](#logrotation)
* [Reporting issues and contact information](#contact)

##<a name="whatis"></a>What is cosmos-admin
cosmos-admin is a set of tools designed to administrate a Cosmos deployment, both for the Sahara-based and shared Hadoop-based flavours.

Available tools are:

* **data\_copier.sh**: a script designed to copy HDFS data from one cluster to another.
* **get\_user\_stats.sh**: a script designed to get certain user statistics (e.g. HDFS usage, last access time, etc.) in a periodic fashion (i.e. as script within the crontab).

[Top](#top)

##<a name="scripts"></a>Scripts
###<a name="datacopier"></a>`data_copier.sh`
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

###<a name="getuserstats"></a>`get_user_stats.sh`

This script has been designed to get certain user statistics, these ones:

* Last access time (timestamp format).
* HDFS usage (number of bytes).
* Local file system usage (number of bytes).
* Number of successful ssh connections.
* Number of failed ssh connections.

The above values are stored within a database usally named `cosmos`,  in a table usually named `cosmos_user`. Follow [this link](../cosmos-gui/README.md#database) for more details about the database.

`get_user_stats.sh` is parameterized by:

* Host running the MySQL server
* Port where the MySQL server listens for requests. Typically, TCP/3306 port.
* Database name. Usually, `cosmos`.
* MySQL user allowd to insert data within the `cosmos` database, `cosmos_user` table.
* Pasword for the MySQL user.
* ssh log file (usually, `/var/log/secure`).

In a shell:

    $ ./get_user_stats.sh <mysql_host> <mysql_port> <db_name> <mysql_user> <mysql_password> <ssh_logs>

Since the above mentioned statistics change along the time, it is useful to schedule this script execution in a periodic fashion, let's say at least once per day. You can use the `crontab` tool for achieving this; take a look on the next section for more details.

At the same time, the system log rotation must be done at the same frequency this script is run. The reason is the ssh log file is used in order to obtain the number of successful and failed connections; therefore, if this is done in a per day fashion, then the system logs must be rotated once per day; if the statistics are got once per week, then the system logs must be rotated once per week as well; and so on. If you don't want to rotate all the system logs at the same frequency this script is executed, at least you must syncronize the ssh log file among all the system log files.

[Top](#top)

##<a name="osprogramming"></a>OS programming regarding the administrative scripts

###<a name="crontab"></a>Crontab
`crontab` is the tool used by any Unix-based system to schedule task executions. In this case, we will use this application in order to schedule some of the Cosmos administrative scripts in a periodic fashion.

Scheduling is done through a file that can be edited by typing:

    $ crontab -e
    
Then, and according to the `crontab` specification, add the following lines:

```
59 23 * * * /usr/local/cron_scripts/get_user_stats.sh
00 00 * * * run-parts /etc/cron.daily
00 00 * * 5 run-parts /etc/cron.weekly
00 00 1 * * run-parts /etc/cron.monthly
```

The first line is about executing the `get_user_stats.sh` script each day at 23:59. The other lines must be added if not existing, and are related to the execution of certain daily, weekly and monthly tasks specified under `/etc/cron.daily`, `/etc/cron.weekly` and `/etc/cron.month` respectively; this includes the rotation of log files (how to configure the log rotation for Cosmos is explained in the next section).

Please observe the `get_user_stats.sh` script is executed exactly one minute before the daily rotation is performed. This is because the `get_user_stats.sh` script must take a snapshot of the `/var/log/secure` file, which must be rotating in a daily fashion (see next section for more details).

[Top](#top)

###<a name="logrotation"></a>Log rotation
Log rotation is usually performed by the `logrotate` application. Since this should be installed and already running by default in all Unix-based machines (check it by running the command `which logrotate`), most probably you will have the following elements in your file system:

* `/etc/logrotate.conf`. Used to configure the application, typically will contain parameters for a weekly rotation of the system logs in general.

```
$ cat /etc/logrotate.conf
# see "man logrotate" for details
# rotate log files weekly
weekly

# keep 4 weeks worth of backlogs
rotate 4

# create new (empty) log files after rotating old ones
create

# use date as a suffix of the rotated file
dateext

# uncomment this if you want your log files compressed
#compress

# RPM packages drop log rotation information into this directory
include /etc/logrotate.d

# no packages own wtmp and btmp -- we'll rotate them here
/var/log/wtmp {
    monthly
    create 0664 root utmp
        minsize 1M
    rotate 1
}

/var/log/btmp {
    missingok
    monthly
    create 0600 root utmp
    rotate 1
}

# system-specific logs may be also be configured here.
``` 

* `/etc/logrotate.d/`. This folder contains particular configurations for some system processes aming a different log rotation than the default one. This may be as simple as adding certain post-rotation executions, or adding a totally different rotation schedule. Each process, e.g. Syslog, will have a file within this folder containig its particular configuration.

```
$ ls /etc/logrotate.d/
chrony  ppp  syslog  wpa_supplicant  yum
$ cat /etc/logrotate.d/syslog
/var/log/cron
/var/log/maillog
/var/log/messages
/var/log/secure
/var/log/spooler
{
    sharedscripts
    postrotate
	/bin/kill -HUP `cat /var/run/syslogd.pid 2> /dev/null` 2> /dev/null || true
    endscript
}

```

As explained before, some administrative scripts used by Cosmos need certain system logs are rotated at the same frequency the scripts are run, in order to synchronize them. This is the case for `/var/log/secure`, the file where the ssh daemon logs. The directives for rotating this file are within the Syslog specific configuration (`/etc/logrotate.d/syslog`), which simply adds a post-rotation execution of a command (the `rsyslogd` daemon restart) to the general configration; thus, it is rotated in a per week fashion. Nevertheless, we may need this file is rotated daily if the `get_user_stats.sh` script is run in a per day fashion as well. In order to achieve this, we must create a specific rotation directives file at `/etc/logrotate.d/` for the `/var/log/secure` file, let's say `/etc/logrotate.d/ssh-secure`, with the following content:

```
$ cat /etc/logrotate.d/ssh-secure
/var/log/secure
{
    daily
    rotate 7
    postrotate
        /bin/kill -HUP `cat /var/run/syslogd.pid 2> /dev/null` 2> /dev/null || true
    endscript
}
```
    
Since the `/var/log/secure` file is now rotated following the directives within `/etc/logrotate.d/ssh-secure`, we must remove such a log file from the `/etc/logrotate.d/syslog` configuration file:

```
$ cat /etc/logrotate.d/syslog
/var/log/cron
/var/log/maillog
/var/log/messages
/var/log/spooler
{
    sharedscripts
    postrotate
        /bin/kill -HUP `cat /var/run/syslogd.pid 2> /dev/null` 2> /dev/null || true
    endscript
}
```

It is possible the first rotation cycle is not executed at the expected time since `logrotate` handles a file named `/var/lib/logrotate.status` where the last rotation times are saved. For instance, if you change the ssh log file rotation from weekly to daily and today was done the last weekly rotation, then the first daily rotation will not execute since `logrotate` is seeing the today date in the status file. You can fix this by simply editing this file and putting a date in the past for `/var/log/secure`.

[Top](#top)

##<a name="contact"></a>Reporting issues and contact information
There are several channels suited for reporting issues and asking for doubts in general. Each one depends on the nature of the question:

* Use [stackoverflow.com](http://stackoverflow.com) for specific questions about this software. Typically, these will be related to installation problems, errors and bugs. Development questions when forking the code are welcome as well. Use the `fiware-cosmos` tag.
* Use [ask.fiware.org](https://ask.fiware.org/questions/) for general questions about FIWARE, e.g. how many cities are using FIWARE, how can I join the accelarator program, etc. Even for general questions about this software, for instance, use cases or architectures you want to discuss.
* Personal email:
    * [francisco.romerobueno@telefonica.com](mailto:francisco.romerobueno@telefonica.com) **[Main contributor]**
    * [fermin.galanmarquez@telefonica.com](mailto:fermin.galanmarquez@telefonica.com) **[Contributor]**

**NOTE**: Please try to avoid personaly emailing the contributors unless they ask for it. In fact, if you send a private email you will probably receive an automatic response enforcing you to use [stackoverflow.com](stackoverflow.com) or [ask.fiware.org](https://ask.fiware.org/questions/). This is because using the mentioned methods will create a public database of knowledge that can be useful for future users; private email is just private and cannot be shared.

[Top](#top)
