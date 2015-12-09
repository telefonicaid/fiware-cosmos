#<a name="top"></a>Stream processing: Sinfonier Topologies

Content:<br>

* [Topology](#section1)
* [First Topology](#section2)
* [Modules](#section3)

##<a name="section1"></a>Topology

Sinfonier is based on a simple four step way.

* Choose modules from the list
* Design a topology
* Start your topology
* Check your topologies and view the logs


After you are logged on Sinfonier it's very simple to start the creation of a new topology, just go to the editor or click the button “New topology” placed in the topologies section, it will redirect you to the editor. Once there, you can start to create a new topology.

You can see all your topologies and **Public** topolgies on "Topologies" section.

![Figure 1 - Sinfonier Topologies List](images/sinfonier_topologies_list.png "Figure 1 - Sinfonier Topologies List")

###<a name="section1.1"></a>Topology templates

All modules on Sinfonier should be publish sometime but not topologies. Topologies will be publish if users want to publish them.

**Why to publish a topolgy?** Just to help community users to create new topologies easily.
**What is sharing on my topology?** When your topology is shared only includes how modules are connected. Templates not include modules params.
**When I use "Use as Template" on my topologies all modules params are included** Sure! If you are using your own template your params are included. This feature allow you to fork your work easily. (We didn't use "fork" word in order to be friendly with nont technnical users.)

##<a name="section2"></a>First Topology

##<a name="section3"></a>Modules

As you read on modules section, **Modules** are the core of Sinfonier. Each one makes a job, join together makes a complex processing system... and shared they are an collective intelligence.	

###<a name="section3.1"></a>Add modules to MyTools

Your first job is search modules you'll need in your topology on "Modules" section. When you find the module that does what you need it's time to add it to your tools. To know what a module does just check details by clicking the name.

![Figure N - Sinfonier Topologies Module Detail](images/sinfonier_topologies_add_modules_1.png "Figure N - Sinfonier Topologies Add Module")

Description should be include all information you need, if not you can check source code using Gist link.

In this point you're sure the module should be in your tools. By clicking on "Add to My Tools" module will be available on your editor.

![Figure N - Sinfonier Topologies Add Module to My Tools](images/sinfonier_topologies_add_modules_2.png "Figure N - Sinfonier Topologies Add Module to My Tools")

The figure below shows the module on the editor ready to be used

![Figure N - Sinfonier Topologies Module on Editor Tools](images/sinfonier_topologies_add_modules_3.png "Figure N - Sinfonier Topologies Module on Editor Tools")

###<a name="section3.2"></a>Gathering

####<a name="section3.2.1"></a>RSS & FEED

RSS is a lightweight, multi purpose, extensible metadata description and syndication format.  RSS is an XML application. RSS is currently used for a number of applications, including news and other headline syndication, weblog syndication, and the propagation of software update lists. It is generally used for any situation when a machine-readable list of textual items and/or metadata about them needs to be distributed.

	<?xml version="1.0" encoding="UTF-8" ?>
	<rss version="2.0">
	<channel>
	 <title>RSS Title</title>
	 <description>This is an example of an RSS feed</description>
	 <link>http://www.example.com/main.html</link>
	 <lastBuildDate>Mon, 06 Sep 2010 00:01:00 +0000 </lastBuildDate>
	 <pubDate>Sun, 06 Sep 2009 16:20:00 +0000</pubDate>
	 <ttl>1800</ttl>
	 
	 <item>
	  <title>Entry title</title>
	  <description>Here is some text containing an interesting description.</description>
	  <link>http://www.example.com/blog/post/1</link>
	  <guid isPermaLink="false">7bd204c6-1655-4c27-aeee-53f933c5395f</guid>
	  <pubDate>Sun, 06 Sep 2009 16:20:00 +0000</pubDate>
	 </item>
	 
	</channel>
	</rss>

Sinfonier can get data from RSS and Atom Feeds using some spouts. As we know Sinfonier has a data model where every tuple is represented by JSON object. Spouts must transform information collected in a JSON Object.

![Figure N - Sinfonier Topologies RSS Module](images/sinfonier_topologies_modules_rss.png "Figure N - Sinfonier Topologies RSS Module")

![Figure N - Sinfonier Topologies Feed Module](images/sinfonier_topologies_modules_feed.png "Figure N - Sinfonier Topologies Feed Module")

####<a name="section3.2.2"></a>Twitter

----

<a href="http://www.youtube.com/watch?feature=player_embedded&v=XhW7AOPTBH0
" target="_blank"><img src="http://img.youtube.com/vi/XhW7AOPTBH0/0.jpg" 
alt="Consume Twitter Stream" width="600" height="400" border="5" /></a>

----

###<a name="section3.3"></a>Persistence

####<a name="section3.3.1"></a>MongoDB

In order to start using MongoDB we'll use MongoLab service. MongoLab is a fully managed cloud database service featuring automated provisioning and scaling of MongoDB databases, backups, 24/7 monitoring and alerting, MongoDB GUI tools, and expert support.

![Figure N - Sinfonier Topologies MongoLab Module](images/sinfonier_topologies_modules_mongolab_logo.png "Figure N - Sinfonier Topologies MongoLab Module")

MongoDB offers a free plan called Sandbox. Users can create unlimited databases with a storage limit and without high-availability, this type of database are perfect for development/testing/staging environments.

MongoDB is a NoSQL database document-oriented database. MongoDB eschews the traditional table-based relational database structure in favor of JSON-like documents with dynamic schemas, making the integration of data in certain types of applications easier and faster. This is why is a really a good travel companion.

MongoDB stores data using a flexible document data model that is similar to JSON. Documents contain one or more fields, including arrays, binary data and sub-documents. Fields can vary from document to document. This flexibility allows development teams to evolve the data model rapidly as their application requirements change.

As Sinfonier implements data model based on JSON documents and creating a sandbox database in Mongolab is too easy: to integrate with MongoDB databases is extremely simple. 

**Creating an Account**

First of all you need an account or create one filling this form properly: https://mongolab.com/signup/

**Create new deployment**

![Figure N - Sinfonier Topologies MongoLab New Deploy](images/sinfonier_topologies_modules_mongolab_new_deploy.png "Figure N - Sinfonier Topologies New Deploy")

**Single node Plan**

Before you make any pay you can start using the sandbox plan included into Single Node MongoDB.

![Figure N - Sinfonier Topologies MongoLab Plan](images/sinfonier_topologies_modules_mongolab_single_node.png "Figure N - Sinfonier Topologies MongoLab Plan")

**Add User**

First step after your database is created is add a new user to access the database. Users can be read-only users.

![Figure N - Sinfonier Topologies MongoLab Add User](images/sinfonier_topologies_modules_mongolab_add_user.png "Figure N - Sinfonier Topologies MongoLab Add User")

**Add a Collection**

At this point we have a MongoDB database and one user to access it. It’s time to create our first collection where we insert each document.

![Figure N - Sinfonier Topologies MongoLab Add Collection](images/sinfonier_topologies_modules_mongolab_add_collection.png "Figure N - Sinfonier Topologies MongoLab Add Collection")

Due to space constraints collections can be created with disk space limit. By taking these measure we ensure our database will be available. Use this option if you are using this storage as a transitional place for your data or just as a log for your application.

![Figure N - Sinfonier Topologies MongoLab Add Collection Capped](images/sinfonier_topologies_modules_mongolab_add_collection_crop.png "Figure N - Sinfonier Topologies MongoLab Add Collection Capped")

**MongoDB URI**

Time to use our database. Use a mongo database with Sinfonier is as easy as get the MongoDB URI and put it in the correct field. You found an URI similar as above in the detail database page.

	mongodb://YourDBUser:YourDBPassword@ds049211.mongolab.com:49211/database_name

![Figure N - Sinfonier Topologies MongoLab Configure Drain](images/sinfonier_topologies_modules_mongolab_configure_drain.png "Figure N - Sinfonier Topologies MongoLab Configure Drain")

###<a name="section3.4"></a>Transformation

####<a name="section3.5.1"></a>TOR Onionoo

Onionoo is a web-based protocol to learn about currently running Tor relays and bridges. 

Onionoo itself was not designed as a service for human beings—at least not directly. Onionoo provides the data for other applications and websites which in turn present Tor network status information to humans.

The Onionoo service is designed as a RESTful web service. Onionoo clients send HTTP GET requests to the Onionoo server which responds with JSON-formatted replies.

![Figure N - Sinfonier Topologies Atlas TOR Bolt](images/sinfonier_topologies_modules_atlas_tor.png "Figure N - Sinfonier Topologies Atlas TOR Bolt")



###<a name="section3.5"></a>Presentation

####<a name="section3.5.1"></a>Instapush

 Instapush lets you receive instant push notifications on your phone or tablet. Instapush implements an API where services can sends notifications fired by specific triggers or events.

Sinfonier Instapush Drain allow users sending notifications associated to a specific event.

![Figure N - Sinfonier Topologies Instapush](images/sinfonier_topologies_modules_instapush.png "Figure N - Sinfonier Topologies Instapush")

Fields description:

* **Traker Fields** are used to create your message. Sinfonier fill each traker with the content from Tuple fields received.
* **Event** identifies your event defined by application.
* **AppSecre** contents your API Secret Value.
* **AppID** identifies your application in InstaPush.

Before you can use this drain on Sinfonier you must to create an Instapush account and create an Application. Let see how to do it:

Create a free account here: https://instapush.im/auth/register.

![Figure N - Sinfonier Topologies Instapush Create APP](images/sinfonier_topologies_modules_instapush_add_app.png "Figure N - Sinfonier Topologies Instapush Create APP")

**Add an application**

![Figure N - Sinfonier Topologies Instapush APP Name](images/sinfonier_topologies_modules_instapush_add_app_name.png "Figure N - Sinfonier Topologies Instapush APP Name")

**Create a new event**

Everything in Instapush is event-based. So specify the event you want to watch add relevant data and submit.

![Figure N - Sinfonier Topologies Instapush Create Event](images/sinfonier_topologies_modules_instapush_creaate_event.png "Figure N - Sinfonier Topologies Instapush Create Event")

**Configure your Drain on Sinfonier**

Once you have your event created it’s time to configure your Drain. Select every field in your tuple (json format) that you want to include as a tracker. Your field name must be equals your tracker field (at least for now, we are working in a new version where you can match trackers and fields with different names.)

![Figure N - Sinfonier Topologies Instapush Configure Drain](images/sinfonier_topologies_modules_instapush_configure_drain.png "Figure N - Sinfonier Topologies Instapush Configure Drain")

Download mobile App

And start receiving notifications immediately! It's as simple as this. The App is available in Google Play for Android and App Store iOS.

![Figure N - Sinfonier Topologies Instapush Configure Drain](images/sinfonier_topologies_modules_instapush_install_app.png "Figure N - Sinfonier Topologies Instapush Configure Drain")

###<a name="section3.6"></a>Display

####<a name="section3.6.1"></a>Neo4j

Neo4j is a world's leading open source Graph Database. It is completely developed by using Java Language by Neo Technology. 

![Figure N - Sinfonier Topologies Neo4j Logo](images/sinfonier_topologies_modules_neo4j_logo.png "Figure N - Sinfonier Topologies Neo4j Logo")

Neo4j is a one of the popular Graph Databases and CQL stands for Cypher Query Language. Neo4j is written in Java Language.

Neo4j is supported by a rich ecosystem of libraries, tools, drivers and guides provided by partners, users and community contributors. We want to give an overview about what’s available and link to the original sources. We try to focus on the freely available solutions here, and provide links to commercial options where appropriate.

**Common uses causes**

* Social Networks
* Recommendation Engines 
* Geo Routing

Sinfonier Neo4jEntitiesLabel Bolt allow users create uniques nodes associated to a specific label.

![Figure N - Sinfonier Topologies Neo4j Neo4jEntitiesLabel](images/sinfonier_topologies_modules_neo4j_neo4jentitieslabel.PNG "Figure N - Sinfonier Topologies Neo4jEntitiesLabel")

Fields description:

* **urlDatabase** are used to connect with your database. REST URL: http://Host:Port/db/data/.
* **user:pass** authorization to database, REST USERNAME:REST PASSWORD.
* **index** value of the index nodes, the node is created if it doesn’t exist in the unique index already.
* **listEntities** 
	+ *Key* : Parameter to identify the key of a node.
	+ *Value* : Parameter to the tuple to identify a node.
	+ *Default* : Parameter to set the label of a node.


Sinfonier Neo4jListParams Drain allow users set parameters to a node associated to a specific key-value.

![Figure N - Sinfonier Topologies Neo4j ParamsNeo](images/sinfonier_topologies_modules_neo4j_paramsneo.PNG "Figure N - Sinfonier Topologies ParamsNeo")

Fields description:

* **urlDatabase** are used to connect with your database. REST URL: http://Host:Port/db/data/.
* **user:pass** authorization to database, REST USERNAME:REST PASSWORD.
* **index** value of the index nodes, the node is created if it doesn’t exist in the unique index already.
* **listEntities** 
	+ *Key* : Parameter to identify the key of a node.
	+ *Value* : Parameter to the tuple to identify a node.
* **listParams** 
	+ *Key* : Parameter to identify the key of a parameter.
	+ *Value* : Parameter to the tuple to set the parameter.


Sinfonier Neo4jRelationshipsUniqueId Drain allow users create uniques relationships between nodes.

![Figure N - Sinfonier Topologies Neo4j RelationsNeo](images/sinfonier_topologies_modules_neo4j_relationsneo.PNG "Figure N - Sinfonier Topologies RelationsNeo")

Fields description:

* **urlDatabase** are used to connect with your database. REST URL: http://Host:Port/db/data/.
* **user:pass** authorization to database, REST USERNAME:REST PASSWORD.
* **index** value of the index nodes, the node is created if it doesn’t exist in the unique index already.
* **key** value of the key which identify to all nodes on the relationships.
* **listEntities** 
	+ *Key* : Parameter to the tuple to identify a start node.
	+ *Value* : Parameter to set the type of the relationship.
	+ *Default* : Parameter to the tuple to identify a end node.

Before you can use these modules on Sinfonier you must to create an Neo4j database, you can download it and install locally on the URL below:

[NEO4J](http://neo4j.com/)

Also you can use a remote database, one website with free account is: [Graphenedb](http://www.graphenedb.com/)

![Figure N - Sinfonier Topologies Neo4j Graphene](images/sinfonier_topologies_modules_neo4j_graphene.PNG "Figure N - Sinfonier Topologies Graphene")

When you have the database right it's time to use the modules. 

This is a topology example to use in a social network.

![Figure N - Sinfonier Topologies Neo4j Topology](images/sinfonier_topologies_modules_neo4j_topology.png "Figure N - Sinfonier Topologies Topology")

In this case the source of information is twitter and all they do is collect both the user screen_name and the URLs appear and store in the database, creating two nodes with URL tags and USERTWITTER, then add some more parameters to create nodes and the relationship between them, the type TWEET.

![Figure N - Sinfonier Topologies Neo4j Topology Zoom](images/sinfonier_topologies_modules_neo4j_topology2.png "Figure N - Sinfonier Topologies Topology Zoom")

And the result of this topology, five minutes after receiving tweets is shown below:

![Figure N - Sinfonier Topologies Neo4j Topology Result](images/graph_result.png "Figure N - Sinfonier Topologies Topology Result")

What can you do?