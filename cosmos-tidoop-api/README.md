#Tidoop REST API
cosmos-tidoop-api exposes a RESTful API for running MapReduce jobs in a shared Hadoop environment.

Why emphasize in <i>a shared Hadoop environment</i>? Because shared Hadoops require special management of the data and the analysis processes being run (storage and computation). There are tools like [Oozie](https://oozie.apache.org/) in charge of running MapReduce jobs as well through an API, but they do not take into account the access to the run jobs, their status, results, etc must be controlled. In other words, using Oozie any user may kill a job by knowing its ID; using cosmos-tidoop-api only the owner of the job will be able to.

The key point is to relate all the MapReduce operations (run, kill, retrieve status, etc) to the user space in HDFS. This way, simple but effective authorization policies can be stablished per user space (in the most basic approach, allowing only a user to access it own user space). This can be easily combined with authentication mechanisms such as [OAuth2](http://oauth.net/2/).

Finally, it is important to remark cosmos-tidoop is being designed to run in a computing cluster, but in charge of analyzing the data within a storage cluster. Sometimes, of course, both storage and computing cluster may be the same, splitted software is ready for that.

Further information can be found in the documentation at [fiware-cosmos.readthedocs.io](http://fiware-cosmos.readthedocs.io/en/latest/).
