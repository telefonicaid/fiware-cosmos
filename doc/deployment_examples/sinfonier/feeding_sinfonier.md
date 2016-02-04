#<a name="top"></a>Sinfonier deployment of Cosmos
Content:

* [Introduction](#section1)
* [Architecture](#section2)
* [Orion contextBroker](#section3)
* [Cygnus](#section4)
* [Kafka](#section5)
    * [Zookeeper](#section5.1)
	  * [Configuration](#section5.1.1)
	  * [Running](#section5.1.2)
    * [Brokers](#section5.2)
        * [Configuration](#section5.2.1)
	  * [Running](#section5.2.2)
* [Sinfonier](#section6)
* [General procedure step-by-step](#section7)
* [Reporting issues and contact information](#section8)

##<a name="section1"></a>Introduction
This document describes how `Sinfonier` can consume the stored context information from [Orion](http://catalogue.fiware.org/enablers/publishsubscribe-context-broker-orion-context-broker).

The purpose is consuming information with `Sinfonier`. `Orion` has context information that could be useful, but we need a way to connect both elements. The use of `Cygnus` and `Kafka`, for traslate and storage the information in a data structure, show the way of connect between `Orion` and `Sinfonier`.

[Top](#top)
##<a name="section2"></a>Architecture
The architecture for feeding `Sinfonier` needs some elements as shown in next image: 
 
![architecture][Architecture]

The objective of this architecture is get a processed information from `Orion` to `Sinfonier`, using `Cygnus` for make the translation and `Kafka` for store the information that will be consumed. 

In next paragraphs all the needed configuration will be described in order to know how it works. 

[Top](#top)

##<a name="section3"></a>Orion contextBroker
First of all [Orion](https://github.com/telefonicaid/fiware-orion/blob/develop/doc/manuals/admin/install.md) must be installed in the system. In addition, `Orion` needs `MongoDB` for storage so must be installed too. 
`Orion` have context information that it's going to be translated through `Cygnus` to `Kafka`. Context information is stored in `Entities` with `Attributes`. 
This structure allow to subscribe to entities for wait the changes in them. Once subscribed all changes are sent to `Cygnus` through a specific port (selected in subscription curl).
Same as subscribing, unsubscription is possible if don't need more changes or if a new subscription is required to another entity.
All this procedures use `curl` for transfering somo data to `Orion` in `JSON` format.

Let's write an example of use creating a new entity with attributes and a subscription to it. 
Follow the general procedure below for create this entity and receive changes in its values.

* Entity: Book1
* Attributes: Title, Pages and Price.

1. Check if `Orion` is running properly, asking `Orion` for its version:
```
curl -X GET http://localhost:1026/version 
```

2. Create a subscription to the entity `Book1`
```
(curl localhost:1026/v1/subscribeContext -s -S --header 'Content-type: application/json' --header 'Accept: application/json' -d @- | python -mjson.tool) <<EOF
{
    "entities": [
        {
            "type": "Book",
            "isPattern": "false",
            "id": "Book1"
        }
    ],
    "attributes": [
    ],
    "reference": "cygnus_destination",
    "duration": "P1M",
    "notifyConditions": [
        {
            "type": "ONCHANGE",
            "condValues": [
                "title",
                "pages",
                "price",
            ]
        }
    ],
    "throttling": "PT5S"
}
EOF
```

There are two JSON special parameters when a susbscription is sent:
* `attributes`: Refers to the attributes that will be notified to `Cygnus`. If empty, all attributes will be notified to `Cygnus`. If not empty, only the attributes wrote here will be notified. In this case, if `Orion` receive a change for the attribute `price` in entity `Book1` all the attributes (`title`, `pages` and `price`) will be sent to `Cygnys`. 
* `condValues`: List of attributes that `Book1` has. When a subscription is done to an entity their attributes must be sent to `Orion`

3. Append some values in entity `Book1`.
```
(curl localhost:1026/v1/updateContext -s -S --header 'Content-Type: application/json' \
     --header 'Accept: application/json' -d @- | python -mjson.tool) <<EOF
{
    "contextElements": [
        {
            "type": "Book",
            "isPattern": "false",
            "id": "Book1",
            "attributes": [
                {
                    "name": "title",
                    "type": "text",
                    "value": "Game of thrones"
                },
                {
                    "name": "pages",
                    "type": "integer",
                    "value": "985"
                },
                {
                    "name": "price",
                    "type": "float",
                    "value": "18.50"
                }
            ]
        }
    ],
    "updateAction": "UPDATE"
} 
EOF
```
This action only store a value in the attributes, isn't a change for notify to `Cygnus`.

After all, there a subscription to `Book1` that will notify all attributes to `Cygnus` in the moment that a value changes (one, two or all attributes). If get a bad subscription or want to change the subscription to another entity or change the notified values, can easily unsubscribe. Only needs the subscription ID previously saved:
```
(curl localhost:1026/v1/unsubscribeContext -s -S --header 'Content-Type: application/json' \
    --header 'Accept: application/json' -d @- | python -mjson.tool) <<EOF
{
    "subscriptionId": "your_subscription_id"
}
EOF
```
In addition, there are a way to know all subscriptions and obtain the ID: 
```
curl -X GET http://localhost:1026/v2/subscriptions

```


[Top](#top)

##<a name="section4"></a>Cygnus
To be done.

[Top](#top)

##<a name="section5"></a>Kafka
[Apache Kafka](http://kafka.apache.org/documentation.html#quickstart) is a distributed, partitioned, replicated commit log service. It provides the funcionality of a messaging system, but with a unique design.
The use of `Kafka` for that purpose have two main pieces: `Zookeeper` and `brokers` (or servers, both names are correct). `Kafka` is needed for storage the translated information received from `Cygnus`.
`Kafka` manage the information with `topics` dealed in `brokers` (or servers) running into `Zookeeper`. The use of `brokers` is an user election, so can have one or more than one.

An important detail is that `Zookeeper` must be running before `Brokers`. Commands for `Brokers` will fail if there isn't a 'Zookeeper` running already. A [general procedure step-by-step](#section7) is described in this document.

[Top](#top)

###<a name="section5.1"></a>Zookeeper
####<a name=”section5.1.1></a>Configuration
`ZooKeeper` is a centralized service for maintaining configuration information, naming, providing distributed synchronization, and providing group services. The connections to `Zookeeper` use the port 2181 and provides the link between itself and brokers. Using the API we can create and ask for information about topics, produce some messages and consume, but the most of the actions are done automatically by `Cygnus`. The only action required for this architecture is to consume, that will carry out Sinfonier.

`Zookeeper`is configured through the following parameters:

| Parameter | Mandatory | Value | Comments |
|---|---|---|---|
| dataDir | yes | /tmp/zookeeper | Directory where the snapshot is stored (Default value) |
| clientPort | yes | 2181 | Default port for Zookeeper |
| maxClientCnxns | yes | 0 | Default value |

`Zookeeper`configuration must be stored in a file called `zookeeper.properties`


####<a name=”section5.1.2></a>Running
Run `Zookeeper`is possible with a command: 
```
bin/zookeeper-server-start.sh config/zookeeper.properties
```
An own terminal is required for this service. Another way is using `nohup` at the start and `&`at the end for running the server in background (Use restricted when brokers are running properly and if you know how `nohup` works) 
``` 
nohup bin/zookeeper-server-start.sh config/zookeeper.properties &
```

[Top](#top)

###<a name="section5.2"></a>Brokers
####<a name=”section5.2.1></a>Configuration
`Brokers` are used to distribute the information stored in `Kafka` and can be used one or several of them. This example use three `Brokers` and its configuration is described in this section. `Brokers` are implemented into 'zookeeper', each one with its own port, i.e, a `broker` with port 9092, another broker with port 9093, etc.
A single `broker` is configured through the following parameters:

| Parameter | Mandatory | Value | Comments |
|---|---|---|---|
| broker.id | yes | 1 | An unique integer that define a broker |
| port | yes | 9092 |  Port assigned to broker 1 | 
| host.name | yes | 0.0.0.0 |  For local connections must be `localhost`. For remote connections `0.0.0.0` allow them | 
| zookeeper.connect | yes | localhost:2181 | Usually zookeeper is running on a local machine. In other case, remote ip access is required with port 2181 |
| log.dirs | yes | /tmp/kafka-logs-1 | kafka-logs-x, being x the broker.id |
| advertised.host.name | no | your_remote_ip |  For remote connections of a known ip that allow it to access to the `broker` |
| advertised.port | no | 9092 | For use a remote port different from the port broker set previously |

A “multibroker” configuration can be configured creating different files, one by broker, and setting same parameters like first, but changing `broker.id`, `port` and `logs.dir`. 

`Brokers` configurations must be stored in files like `serverx.properties`, being "x" the `broker.id` of each `Broker`.

####<a name=”section5.2.2></a>Running
Run a server is possible with a command:
```
bin/kafka-server-start.sh config/server1.properties
```
In case of “multibroker” cluster:
```
bin/kafka-server-start.sh config/server1.properties
bin/kafka-server-start.sh config/server2.properties
bin/kafka-server-start.sh config/server3.properties
```
Differents terminals are required for each server. Another way is using `nohup` at the start and `&`at the end for running the server in background (Use restricted when brokers are running properly and if you know how `nohup` works)
``` 
nohup bin/kafka-server-start.sh config/server1.properties &
```

[Top](#top)

##<a name="section6"></a>Sinfonier
To be done.
[Top](#top)

##<a name="section7"></a>General procedure step-by-step
The following steps will help you to run all the procedure properly. A specific order is required because the architecture need some services before others. Let's start:
1. Orion context broker: First step in order to create the subscriptions and receive the entity changes, that will be redirected to Cygnus. Mongo must be running too.
2. Kafka: Zookeeper and brokers. Previous to Cygnus. And consequently:
..1. [Zookeeper](#section5.1.2)
..2. [Brokers](#section5.2.2)
3. Cygnus: Connect to Zookeeper in order to persist the information on Kafka.
4. Sinfonier: WAITING PROCEDURE.
 
[Top](#top)

##<a name="section3"></a> Reporting issues and contact information
There are several channels suited for reporting issues and asking for doubts in general. Each one depends on the nature of the question:

* Use [stackoverflow.com](http://stackoverflow.com) for specific questions about this software. Typically, these will be related to installation problems, errors and bugs. Development questions when forking the code are welcome as well. Use the `fiware-cygnus` tag.
* Use [ask.fiware.org](https://ask.fiware.org/questions/) for general questions about FIWARE, e.g. how many cities are using FIWARE, how can I join the accelarator program, etc. Even for general questions about this software, for instance, use cases or architectures you want to discuss.
* Personal email:
    * [francisco.romerobueno@telefonica.com](mailto:francisco.romerobueno@telefonica.com) **[Main contributor]**
    * [fermin.galanmarquez@telefonica.com](mailto:fermin.galanmarquez@telefonica.com) **[Contributor]**
    * [german.torodelvalle@telefonica.com](german.torodelvalle@telefonica.com) **[Contributor]**
    * [ivan.ariasleon@telefonica.com](mailto:ivan.ariasleon@telefonica.com) **[Quality Assurance]**
    * [pablo.coellovillalba@telefonica.com](mailto:pablo.coellovillalba@telefonica.com) **[Contributor]**

**NOTE**: Please try to avoid personaly emailing the contributors unless they ask for it. In fact, if you send a private email you will probably receive an automatic response enforcing you to use [stackoverflow.com](stackoverflow.com) or [ask.fiware.org](https://ask.fiware.org/questions/). This is because using the mentioned methods will create a public database of knowledge that can be useful for future users; private email is just private and cannot be shared.

[Top](#top)

[Architecture]: https://github.com/telefonicaid/fiware-cosmos/blob/hardening/145_add_documentation_for_consuming_context_data_from_sinfonier/doc/deployment_examples/sinfonier/img/OrionCygnusKafkaSinfonier.jpeg "Architecture for sinfonier"
