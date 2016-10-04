#<a name="top"></a>Requesting computing resources

Content:<br>

* [Sahara version](#section1)
* [Shared Hadoop version](#section2)

##<a name="section1"></a>Sahara version

On the one hand, please refer to the following APIs in order to request a computing cluster based on Hadoop:

* [Clusters API](http://developer.openstack.org/api-ref-data-processing-v1.1.html#v1.1clusters).
* [Cluster templates API](http://developer.openstack.org/api-ref-data-processing-v1.1.html#v1.1clustertemplate).

Of course, you may need all the other [APIs](http://developer.openstack.org/api-ref-data-processing-v1.1.html) when specifying the cluster's node characteristics, their base image, etc.

On the other hand, the Sahara Dashboard wraps the above APIs through a user-friendly UI. You can find all the details in the [official documentation](http://docs.openstack.org/developer/sahara/icehouse/horizon/dashboard.user.guide.html).

[Top](#top)

##<a name="section2"></a>Shared Hadoop version

Current version of the Cosmos GUI does not implements any resources management, i.e. all users have access to the computing cluster with no constraints on terms of time the cluster can be used, and how many computing resources can be used.

This is envisioned to change in next release of the GUI, where a calendar-like feature will be implemented for an efficient cluster consumption based on the time and the amount of available resources.

[Top](#top)

