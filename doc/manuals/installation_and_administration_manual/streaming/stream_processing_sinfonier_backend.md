#<a name="top"></a>Stream processing: Sinfonier Backend

Content:<br>

* [Sinfonier Backend](#section1)
* [Requisites](#section2)
* [Install](#section3)
* [How It Works](#section4)

##<a name="section1"></a>Sinfonier Backend

Sinfoner BackEnd allow to deploy Apache Storm Topologies defined using XML into Apache Storm Cluster. It's the final step on Sinfonier Project architecture and It's used by [Sinfonier API](https://github.com/sinfonier-project/sinfonier-api)

[Top](#top)

##<a name="section2"></a>Requisites

Sinfonier BackEnd use [Apache Maven](https://maven.apache.org/) to manage Java dependencies.

    cd /tmp
    wget http://apache.rediris.es/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.zip
    cd /usr/local/
    sudo unzip /tmp/apache-maven-3.3.9-bin.zip
    sudo ln -s apache-maven-3.3.9/ maven

[Top](#top)

##<a name="section3"></a>Install

**Create folders**

```sh
/var/storm/lastjar
/var/storm/src
/var/storm/topologies
```

**Change owner user**

```sh
chown storm:storm lastjar/
chown storm:storm topologies/
chown storm:storm src/
```

**Clone repository into /var/storm/src**

    git clone https://github.com/sinfonier-project/sinfonier-backend.git

**Create JAR to start deploing topologies**

    <MAVEN_PATH>/bin/mvn -f /var/storm/src/sinfonier_backend/pom.xml clean compile install
    <MAVEN_PATH>/bin/mvn -f /var/storm/src/sinfonier_backend/pom.xml package

Configure this paths on Sinfonier API and start using Apache Storm in the simplest way.

[Top](#top)

##<a name="section4"></a>How It Works

DynamicTopology class reads XML configuration file from the classpath and set up the topology in a Apache Storm cluster. Also declare multilanguage static classes to use in Storm topologies.

**XML**

XML contains the definition of Topology. Contains all Spouts, Bolts and Drains, all parameters associated to each module and how they are connected.

A Topology is defined when It has at least one Spout and one Drain.

```xml
<builderConfig>
    <spouts>
        <spout class='com.sinfonier.spouts.RSS' abstractionId='rss_fffccbb6' >
            <url>http://www.cvedetails.com/vulnerability-feed.php?vendor_id=0&amp;product_id=0&amp;version_id=0&amp;orderby=3&amp;cvssscoremin=0</url>
            <frequency>300</frequency>
            <parallelism>1</parallelism>
        </spout>
    </spouts>
    <bolts>
        <bolt class='com.sinfonier.bolts.Rename' abstractionId='rename_500beebb' >
            <sources>
                <source>
                    <sourceId>rss_fffccbb6</sourceId>
                    <grouping>shuffle</grouping>
                </source>
            </sources>
            <find>title</find>
            <replace>rsstitle</replace>
            <parallelism>2</parallelism>
        </bolt>
    </bolts>
    <drains>
        <drain class='com.sinfonier.drains.LogIt' abstractionId='logit_1b4152dd' >
            <sources>
                <source>
                    <sourceId>rename_500beebb</sourceId>
                    <grouping>shuffle</grouping>
                </source>
            </sources>
            <parallelism>1</parallelism>
            <entity>unknown</entity>
        </drain>
    </drains>
</builderConfig>
```