#<a name="top"></a>Stream processing: Sinfonier API

Content:<br>

* [Sinfonier API](#section1)
* [Requisites](#section2)
* [Install](#section3)
* [Configure](#section4)
* [References](#section5)

##<a name="section1"></a>Sinfonier API

Sinfonier API was develop to manage [Sinfonier Backend](https://github.com/sinfonier-project/sinfonier-backend) and deal with Apache Storm cluster. This software is part of [Sinfonier-Project](http://sinfonier-project.net)

Main features are:

* Compile modules
* Manage Sinfonier Backend classpath
* Start/Stop Storm toplogies
* Storm Log management

[Top](#top)

##<a name="section2"></a>Requisites

**Dependencies**

Jinga2

```sh
$ cd /tmp/
$ wget https://pypi.python.org/packages/source/J/Jinja2/Jinja2-2.8.tar.gz
$ tar xvf Jinja2-2.8.tar.gz
$ cd Jinja2-2.8/
$ sudo python setup.py install
```

Crypto

```sh
$ sudo yum install python-crypto
```

PIP Dependencies

```sh
$ sudo pip install tornado requests pymongo simplegist paramiko scp BeautifulSoup4
```

[Top](#top)

##<a name="section3"></a>Install

```sh
$ cd /opt
$ git clone https://github.com/sinfonier-project/sinfonier-api.git
$ python sinfonierapicore.py

```

[Top](#top)

##<a name="section4"></a>Configure 

**MONGO CONFIG**

```python
define("port", default=8899, help="run on the given port", type=int)
define("concurrency", default=0, help="num of proceess", type=int)
define("mongo_host", default="localhost", help="sinfonier database host")
define("mongo_database", default="sinfonier", help="mongo database name")
define("mongo_collection", default="topologies", help="mongo collection name")
```

**STORM CLUSTER GLOBAL CONFIG**

```python
define("storm_binary", default="<STORM_PATH>/bin/storm", help="storm binay")
define("storm_global_jar_path", default="/var/storm/lastjar/", help="storm binary path")
define("storm_global_jar_bin", default="sinfonier-community-1.0.0.jar", help="storm binay")
```

**TOPOLOGIES CONFIG**

```python
define("storm_topology_path", default="/var/storm/topologies/", help="storm xml path")
define("storm_topology_config_path", default="/config/", help="storm topology config folder")
define("storm_topology_data_path", default="/data/storm/topologies/", help="topologies data path")
define("storm_topology_jar_path", default="/jar/", help="storm topology config folder")
```

**FOLDER STRUCTURE**

    /var/storm/topologies/{topologyName}/config/{topologyName}.xml

**MAVEN CONFIG**

```python
define("maven_binary", default="<MAVEN_PATH>/bin/mvn", help="maven binay")
define("maven_sinfonier_pom", default="/var/storm/src/sinfonier_backend/pom.xml", help="maven pom")
define("maven_sinfonier_m2_pom", default="/var/storm/src/sinfonier_backend/m2-pom.xml", help="maven m2-pom")
```

**STORMBACKEND**
```python
define("backend_working_path", default="/var/storm/src/sinfonier_backend/", help="backend path")
define("backend_python_path", default="/var/storm/src/sinfonier_backend/multilang/resources/", help="backend python path")
define("backend_java_path", default="/var/storm/src/sinfonier_backend/src/jvm/com/sinfonier/", help="backend java path")

define("backend_java_path_drains", default="/var/storm/src/sinfonier_backend/src/jvm/com/sinfonier/drains/", help="backend drains")
define("backend_java_path_bolts", default="/var/storm/src/sinfonier_backend/src/jvm/com/sinfonier/bolts/", help="backend bolts")
define("backend_java_path_spouts", default="/var/storm/src/sinfonier_backend/src/jvm/com/sinfonier/spouts/", help="backend spouts")
```

**API TEMPLATES**

```python
define("backend_template_path", default="/opt/sinfonier-api/templates/", help="API templates")
```

**GIST CREDENTIALS**

```python
define("gist_api_token",default="<YOUR_GIST_TOKEN>",help="gist api token")
define("gist_username",default="<GIST_USER>",help="gist username")
```

[Top](#top)

##<a name="section5"></a>References

* http://www.tornadoweb.org/en/stable/
* http://storm.apache.org/
* https://maven.apache.org/

