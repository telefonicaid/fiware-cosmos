#<a name="top"></a>Sinfonier deployment of Cosmos
Content:

* [Introduction](#section1)
* [Architecture](#section2)
* [Orion contextBroker](#section3)
* [Cygnus](#section4)
    * [Configuration](#section4.1)
    * [Running](#section4.2)
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
This document describes how Sinfonier can consume historic context information handled by [Orion](https://github.com/telefonicaid/fiware-orion) and stored by [Cygnus](https://github.com/telefonicaid/fiware-cygnus).

The purpose is consuming information with Sinfonier. Orion has context information that could be useful, but we need a way to connect both elements. The deployment of Cygnus and Kafka, for translating and storing the information in a data structure, implements the connection between Orion and Sinfonier.

[Top](#top)
##<a name="section2"></a>Architecture
The architecture for feeding Sinfonier needs some elements as shown in next image:

![architecture][Architecture]

The objective of this architecture is get a processed information from Orion to Sinfonier, using Cygnus for translate and Kafka for store the information that will be consumed.

There are two ways to run the architecture:
* All components in the same machine.
* All components in a distributed fashion.

[Top](#top)

##<a name="section3"></a>Orion contextBroker
First of all, [Orion](https://github.com/telefonicaid/fiware-orion/blob/develop/doc/manuals/admin/install.md) must be installed in the system. In addition, Orion needs MongoDB for storage, so must be installed too.

Orion contextBroker must be running in `multiservice` mode with the command:

```
contextBroker -multiservice
```

Orion handles context information which is stored as `entities` holding `attributes`.

This structure allows to subscribe to `entities` and wait for changes in them. Once subscribed all changes are sent to Cygnus through a specific port (set in subscription curl).
Same as subscribing, unsubscription is possible if you don't need more changes or if a new subscription is required to another entity.

Let's write an example of use creating a new entity with attributes and a subscription to it.
Follow the general procedure below for create this entity and receive changes in its values.

* Entity: Book1
* Type: Book
* Attributes: Title, Pages and Price.

A `Fiware-Service` and a `Fiware-ServicePath` must be defined during all the process: Subscription to Orion, Append values and Update the content. In this case we are going to select a descriptive parameters:

* Fiware-Service: LibraryOrion
* Fiware-ServicePath: /catalog

Let's start with the process:

1. Check if Orion is running properly, asking Orion for its version:
```
curl -X GET http://localhost:1026/version
```
(Note that `curl` is just one option for sending the requests).

2. Create a subscription to the entity `Book1` of type `Book`, with Fiware-Service `LibraryOrion` and Fiware-ServicePath `/catalog`.
```
(curl localhost:1026/v1/subscribeContext -s -S --header 'Content-type: application/json' --header 'Accept: application/json' --header 'Fiware-Service: LibraryOrion' --header 'Fiware-ServicePath: /catalog' -d @- | python -mjson.tool) <<EOF
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
    "reference": "http://localhost:5050/notify",
    "duration": "P1M",
    "notifyConditions": [
        {
            "type": "ONCHANGE",
            "condValues": [
                "title",
                "pages",
                "price"
            ]
        }
    ],
    "throttling": "PT5S"
}
EOF
```

There are three JSON special parameters when a subscription is sent:
* `attributes`: Refers to the attributes that will be notified to Cygnus. If empty, all attributes will be notified to Cygnus. If not, only the attributes wrote here will be notified. In this case, if Orion receive a change for the attribute `price` in entity `Book1` all the attributes (`title`, `pages` and `price`) will be sent to Cygnus.
* `condValues`: List of attributes that `Book1` has. When a subscription is done to an entity their attributes must be sent to Orion
* `reference`: Destination of notifications. In this case we use `http://localhost:5050/notify` but you can configure it with your own destination. This parameter involve that our Cygnus must be configured as destination.

Once sent, you will receive something like this:
```
{
    "subscribeResponse": {
        "duration": "P1M",
        "subscriptionId": "your_subscription_id",
        "throttling": "PT5S"
    }
}  
```
The value `subscriptionId` is very important. It's highly recommended to save it in case of you need to unsubscribe to the entity in the future.

If you receive another answer from Orion check your curl: `JSON Parse Error` is a typical error. In that case you will receive this message:
```
{
    "subscribeError": {
        "errorCode": {
            "code": "400",
            "details": "JSON Parse Error",
            "reasonPhrase": "Bad Request"
        }
    }
}   
```

3. Create an entity `Book1` of type `Book`, with Fiware-Service `LibraryOrion` and Fiware-ServicePath `/catalog` in Orion; we will use the `updateContext` operation of the Orion API with the `APPEND` value for creating:
```
(curl localhost:1026/v1/updateContext -s -S --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'Fiware-Service: LibraryOrion' --header 'Fiware-ServicePath: /catalog' -d @- | python -mjson.tool) <<EOF
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
                    "value": "Game of Thrones"
                },
                {
                    "name": "pages",
                    "type": "integer",
                    "value": "927"
                },
                {
                    "name": "price",
                    "type": "float",
                    "value": "18.50"
                }
            ]
        }
    ],
    "updateAction": "APPEND"
}
EOF
```
This action only store a value in the attributes, isn't a change for notify to Cygnus. You will receive:
```
{
    "contextResponses": [
        {
            "contextElement": {
                "attributes": [
                    {
                        "name": "title",
                        "type": "text",
                        "value": ""
                    },
                    {
                        "name": "pages",
                        "type": "integer",
                        "value": ""
                    },
                    {
                        "name": "price",
                        "type": "float",
                        "value": ""
                    }
                ],
                "id": "Book1",
                "isPattern": "false",
                "type": "Book"
            },
            "statusCode": {
                "code": "200",
                "reasonPhrase": "OK"
            }
        }
    ]
}   
```

4.  When you have your subscription and some appended values it's time to update them. This updates are going to be sent to Cygnus. The way for updating is through the `updateContext` operation, but using the `UPDATE` option. We're going to do this update in the entity `Book1` of type `Book`, with Fiware-Service `LibraryOrion` and Fiware-ServicePath `/catalog`. Let's see:
```
(curl localhost:1026/v1/updateContext -s -S --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'Fiware-Service: LibraryOrion' --header 'Fiware-ServicePath: /catalog' -d @- | python -mjson.tool) <<EOF
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
                    "value": "Game of thrones: A song of ice and fire"
                },
                {
                    "name": "pages",
                    "type": "integer",
                    "value": "985"
                },
                {
                    "name": "price",
                    "type": "float",
                    "value": "23.50"
                }
            ]
        }
    ],
    "updateAction": "UPDATE"
}
EOF
```
As you can see we send different values. The response is the same as `APPEND`.

After all, there a subscription to `Book1` that will notify all attributes to Cygnus in the moment that a value changes (one, two or all attributes). If you got a bad subscription or want to change it to another entity or change the notified values, you can easily unsubscribe. Only needs the subscription ID previously saved:
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
####<a name=”section4.1></a>Configuration
[Cygnus](https://github.com/telefonicaid/fiware-cygnus) is a connector in charge of persisting Orion context data in certain configured third-party storages, creating a historical view of such data. In other words, Orion only stores the last value regarding an entity's attribute, and if an older value is required then you will have to persist it in other storage, value by value, using Cygnus.

In this architecture Cygnus do the translation between Orion and Kafka. First of all you have to follow a [quick start guide](https://github.com/telefonicaid/fiware-cygnus/blob/master/doc/quick_start_guide.md#installing-cygnus) for install it. Next step is create a properly agent for Kafka. Every agent has to configure three main elements:
* Source: Where Orion notifications are received. In our case we use port 5050 and HTTP protocol.
* Channel: The bridge between Source and Sink. Here we can set the channel capacity and transaction capacity.
* Sink: Catch the notifications sent from Source through channel and persist it into Kafka (in this case, but Cygnus is able to persist Orion context data in HDFS, MySQL, CKAN, MongoDB, STH and DynamoDB).

Configure the agent like this:
```
cygnusagent.sources = http-source
cygnusagent.sinks = kafka-sink
cygnusagent.channels = kafka-channel

cygnusagent.sources.http-source.channels = kafka-channel
cygnusagent.sources.http-source.type = org.apache.flume.source.http.HTTPSource
cygnusagent.sources.http-source.port = 5050
cygnusagent.sources.http-source.handler = com.telefonica.iot.cygnus.handlers.NGSIRestHandler
cygnusagent.sources.http-source.handler.notification_target = /notify
cygnusagent.sources.http-source.handler.default_service = def_serv
cygnusagent.sources.http-source.handler.default_service_path = /def_servpath
cygnusagent.sources.http-source.handler.events_ttl = 2
cygnusagent.sources.http-source.interceptors = ts gi
cygnusagent.sources.http-source.interceptors.ts.type = timestamp
cygnusagent.sources.http-source.interceptors.gi.type = com.telefonica.iot.cygnus.interceptors.NGSIGroupingInterceptor$Builder
cygnusagent.sources.http-source.interceptors.gi.grouping_rules_conf_file = /path/to/your/grouping_rules/conf/grouping_rules.conf

cygnusagent.channels.kafka-channel.type = memory
cygnusagent.channels.kafka-channel.capacity = 1000
cygnusagent.channels.kafka-channel.trasactionCapacity = 100

cygnusagent.sinks.kafka-sink.type = com.telefonica.iot.cygnus.sinks.NGSIKafkaSink
cygnusagent.sinks.kafka-sink.channel = kafka-channel
cygnusagent.sinks.kafka-sink.enable_grouping = true
cygnusagent.sinks.kafka-sink.data_model = dm-by-entity
cygnusagent.sinks.kafka-sink.broker_list = localhost:9092, localhost:9093, localhost:9094
cygnusagent.sinks.kafka-sink.zookeeper_endpoint = localhost:2181
cygnusagent.sinks.kafka-sink.batch_size = 1
cygnusagent.sinks.kafka-sink.batch_timeout = 10
```
Some important details:
* `cygnusagent.sinks.kafka-sink.broker_list` : Need the IP and port of your Kafka `brokers`. See [next section](#section5.1) for more information about Kafka.
* `cygnusagent.sinks.kafka-sink.zookeeper_endpoint`: In this case, we are running Zookeeper in `localhost` with port 2181 (Zookeeper port). See [next section](#section5.2) for more information about Zookeeper.
* `cygnusagent.sinks.kafka-sink.data_model`: Cygnus parameter. Use dm-by-entity for a descriptive storage.

Running properly all the structure (See [general procedure step-by-step](#section7) for do it properly) and updating some values in our `Entity` you can see how Cygnus persist the information.

####<a name=”section4.2></a>Running
Cygnus is run through this command:
```
/path/to/flume/folder/bin/flume-ng agent --conf /path/to/flume/folder/conf -f /path/to/flume/folder/conf/your_kafka_agent.conf -n cygnusagent -Dflume.root.logger=INFO,console
```
An own shell is required for this service. Another way is using `nohup` at the start and `&`at the end for running the server in background (Use restricted when brokers are running properly and if you know how `nohup` works)
```
nohup /path/to/flume/folder/bin/flume-ng agent --conf /path/to/flume/folder/conf -f /path/to/flume/folder/conf/your_kafka_agent.conf -n cygnusagent -Dflume.root.logger=INFO,console &
```

Once you have your Cygnus running and update some values on Orion the notification will be persisted. You will see logs like:
```
2016-XX-XX 09:13:57,365 (SinkRunner-PollingRunner-DefaultSinkProcessor) [INFO - com.telefonica.iot.cygnus.sinks.NGSIKafkaSink.persistAggregation(NGSIKafkaSink.java:264)] [kafka-sink] Persisting data at NGSIKafkaSink. Topic (libraryorion_catalog_book1_book), Data ({"headers":[{"fiware-service":"LibraryOrion"},{"fiware-servicePath":"/catalog"},{"timestamp":1451981636718}],"body":{"attributes":[{"name":"title","type":"text","value":"Game of thrones: A song of ice and fire"},{"name":"pages","type":"integer","value":"985"},{"name":"price","type":"float","value":"23.50"}],"type":"Book",
"isPattern":"false","id":"Book1"}})
2016-XX-XX 09:13:57,414 (SinkRunner-PollingRunner-DefaultSinkProcessor) [INFO - com.telefonica.iot.cygnus.sinks.OrionSink.process(OrionSink.java:196)] Finishing transaction (1451981632-289-0000000000)
```
As you can see, the information is persisted in a `topic` "Book1_Book" with `attributes` title, pages and price. The values match with the last update that we did in Orion.

[Top](#top)

##<a name="section5"></a>Kafka
[Apache Kafka](http://kafka.apache.org/documentation.html#quickstart) is a distributed, partitioned, replicated commit log service. It provides the functionality of a messaging system, but with a unique design.
The use of Kafka for that purpose have two main pieces: Zookeeper and `brokers` (or servers, both names are correct). Kafka is needed for storing the context information handled by the combination of Orion and Cygnus.

Kafka manages the information through `topics` distributed in `brokers` (or servers) running into Zookeeper. The number of `brokers` to be used is up to the user.

An important detail is that Zookeeper must be running before `brokers`. Commands for `brokers` will fail if there isn't a Zookeeper running already. A [general procedure step-by-step](#section7) is described in this document.

[Top](#top)

###<a name="section5.1"></a>Zookeeper
####<a name=”section5.1.1></a>Configuration
Zookeeper is a centralized service for maintaining configuration information, naming, providing distributed synchronization, and providing group services. The connections to Zookeeper use the port 2181 and provides the link between itself and brokers. Using the API we can create and ask for information about topics, produce some messages and consume, but the most of the actions are done automatically by Cygnus. The only action required for this architecture is to consume, that will carry out Sinfonier.

Zookeeper is configured through the following parameters:

| Parameter | Mandatory | Value | Comments |
|---|---|---|---|
| dataDir | yes | /tmp/zookeeper | Directory where the snapshot is stored (Default value) |
| clientPort | yes | 2181 | Default port for Zookeeper |
| maxClientCnxns | yes | 0 | Default value |

Zookeeper configuration must be stored in a file called `zookeeper.properties`

[Top](#top)

####<a name=”section5.1.2></a>Running
Zookeeper is run through this command:
```
bin/zookeeper-server-start.sh config/zookeeper.properties
```
An own shell is required for this service. Another way is using `nohup` at the start and `&`at the end for running the server in background (Use restricted when brokers are running properly and if you know how `nohup` works)
```
nohup bin/zookeeper-server-start.sh config/zookeeper.properties &
```

[Top](#top)

###<a name="section5.2"></a>Brokers
####<a name=”section5.2.1></a>Configuration
`Brokers` are used to distribute the information stored in Kafka and you can use one or several of them. This example use three `brokers` and its configuration is described in this section. `Brokers` are implemented into Zookeeper, each one with its own port, i.e, a `Broker` with port 9092, another broker with port 9093, etc.
A single `Broker` is configured through the following parameters:

| Parameter | Mandatory | Value | Comments |
|---|---|---|---|
| broker.id | yes | 1 | An unique integer that define a broker |
| port | yes | 9092 |  Port assigned to broker 1 |
| host.name | yes | 0.0.0.0 |  For local connections must be `localhost`. For remote connections `0.0.0.0` allow them |
| zookeeper.connect | yes | localhost:2181 | Usually Zookeeper is running on a local machine. In other case, remote IP access is required with port 2181 |
| log.dirs | yes | /tmp/kafka-logs-1 | kafka-logs-x, being x the broker.id |
| advertised.host.name | no | your_remote_ip |  For remote connections of a known IP that allow it to access to the `broker` |
| advertised.port | no | 9092 | For use a remote port different from the port broker set previously |

A “multibroker” configuration can be configured by creating different files, one per `Broker`, and setting same parameters like the first one, but changing `broker.id`, `port` and `logs.dir`.

`Brokers` configurations must be stored in files like `serverx.properties`, being "x" the `broker.id` of each `Broker`.

####<a name=”section5.2.2></a>Running
A single server is run through this command:
```
bin/kafka-server-start.sh config/server1.properties
```
In case of “multibroker” cluster:
```
bin/kafka-server-start.sh config/server1.properties
bin/kafka-server-start.sh config/server2.properties
bin/kafka-server-start.sh config/server3.properties
```
Different shells are required for each server. Another way is using `nohup` at the start and `&`at the end for running the server in background (Use restricted when brokers are running properly and if you know how `nohup` works).
```
nohup bin/kafka-server-start.sh config/server1.properties &
```

[Top](#top)

##<a name="section6"></a>Sinfonier
Finally we reach the last element of our architecture: The consumer of the stored data. Sinfonier works as consumer, asking Kafka for information coming from Orion.

Kafka works as a queue, receiving data from the producers and sending it to the consumers. Regarding this particular architecture, Cygnus works as a producer, while Sinfonier works as a consumer.

[Top](#top)

##<a name="section7"></a>General procedure step-by-step
The following steps will help you to run all the procedure properly. A specific order is required because the architecture need some services running before the others:
  1. Orion context broker: First step in order to create the subscriptions and receive the entity updates, that will be redirected to Cygnus. `Mongo` must be running too.
  2. Kafka: Zookeeper and `brokers`, and consequently:
    1. [Zookeeper](#section5): Running Zookeeper section.
    2. [Brokers](#section5): Running brokers section.
  3. Cygnus: Connect to Zookeeper in order to persist the information on Kafka.
  4. Sinfonier.

[Top](#top)

##<a name="section3"></a> Reporting issues and contact information
There are several channels suited for reporting issues and asking for doubts in general. Each one depends on the nature of the question:

* Use [stackoverflow.com](http://stackoverflow.com) for specific questions about this software. Typically, these will be related to installation problems, errors and bugs. Development questions when forking the code are welcome as well. Use the `fiware-cygnus` tag.
* Use [ask.fiware.org](https://ask.fiware.org/questions/) for general questions about FIWARE, e.g. how many cities are using FIWARE, how can I join the accelerator program, etc. Even for general questions about this software, for instance, use cases or architectures you want to discuss.
* Personal email:
    * [francisco.romerobueno@telefonica.com](mailto:francisco.romerobueno@telefonica.com) **[Main contributor]**
    * [pablo.coellovillalba@telefonica.com](mailto:pablo.coellovillalba@telefonica.com) **[Contributor]**

**NOTE**: Please try to avoid personaly emailing the contributors unless they ask for it. In fact, if you send a private email you will probably receive an automatic response enforcing you to use [stackoverflow.com](stackoverflow.com) or [ask.fiware.org](https://ask.fiware.org/questions/). This is because using the mentioned methods will create a public database of knowledge that can be useful for future users; private email is just private and cannot be shared.

[Top](#top)

[Architecture]: https://github.com/telefonicaid/fiware-cosmos/blob/develop/doc/deployment_examples/sinfonier/feeding_sinfonier.md "Sinfonier architecture"
