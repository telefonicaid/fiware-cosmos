#<a name="top"></a>HAAS engine (Sahara version)

Content:<br>

* [Installation](#section1)
* [Configuration](#section2)
* [Running](#section3)
* [Administration](#section4)

##<a name="section1"></a>Installation

Being another service for Openstack, [Sahara](http://wiki.openstack.org/wiki/Sahara) has no sense without other Openstack services such as Nova, Horizon or Keystone. Despite it is not the goal of this guide to show you how to install Openstack, here are some pointers:

* Using [Fuel](http://docs.mirantis.com/openstack/fuel/fuel-6.0/virtualbox.html), the Mirantis installer.
* Using [RDO Manager](http://www.rdoproject.org/Quickstart), from RDO, the community of people using and deploying OpenStack on Red Hat Enterprise Linux/Fedora/CentOS/Scientific Linux.

If using any of the above methods, Sahara's installation [wiki](http://docs.openstack.org/developer/sahara/icehouse/userdoc/installation.guide.html) will tell you how to add the Sahara pluggin. In the case of Fuel, Sahara is enabled during the installation, but in the case of RDO Manager, Sahara must be installed after installing Openstack.

Nevertheless, the **preferred method for installing both Openstack and Sahara is [Devstack](http://docs.openstack.org/developer/devstack/)**. Typically, Openstack is installed in an infrastructure comprising [several nodes](http://docs.openstack.org/developer/devstack/guides/multinode-lab.html); but you can test it on a [single machine](http://docs.openstack.org/developer/devstack/guides/single-machine.html)).

Independently of the ammount of infrastructure used, Sahara can be installed at the same time than the other services by simply adding this line to the `local.conf` file:

    enable_service sahara

Once the installation has finished, a message similar to the following one must appear:

    This is your host ip: 10.95.217.148
    Horizon is now available at http://10.95.217.148/
    Keystone is serving at http://10.95.217.148:5000/
    The default users are: admin and demo
    The password: xxxxxxxx

As you may observe, two Openstack users (admin and demo) have been created. The admin user is a priviledged user allowed to administrate Openstack; the demo user is just a "normal" dummy user.

[Top](#top)

##<a name="section2"></a>Configuration

Please refer to the [configuration](http://docs.openstack.org/developer/devstack/guides/multinode-lab.html#configure-cluster-controller) section of Devstack if setting up a multi-node deployment.

Please refer to the [configuration](http://docs.openstack.org/developer/devstack/guides/single-machine.html#run-devstack) section of Devstack if setting up a single-machine deployment.

[Top](#top)

##<a name="section3"></a>Running

Sahara (and all the other Openstack services) starts once installed with `stack.sh`. Running `unstack.sh` will shut down all the Openstack services, freeing up any resource they may have been consuming; in order to restart the environment, do not stack again, but run `rejoin-stack.sh` instead.

Rejoining the stack will print the output of a "parent" `screen` process that encapsulates the per-service `screen` process Devstack starts. This is because Devstack do not uses any init script, the services are run in foreground as standalone daemons and thus you will have to interact with them through the `screen` command.

You can navigate through the parent screen by using `ctrl + a + n` (next) or `ctrl + a + n` (previous). In order to stop a service, simply do `ctrl + c` and run the last command for that screen (it will appear after pressing the up key).

[Top](#top)

##<a name="section4"></a>Administration

The best option for administrating Openstack (including Sahara) is to install the different [command-line clients](http://docs.openstack.org/cli-reference/content/section_cli_overview.html). These are Python-based CLIs wrapping the Openstack REST APIs, thus Python and some other tools (setuptools and PIP) must be installed if you plan to use the CLIs; all the details can be found [here](http://docs.openstack.org/cli-reference/content/install_clients.html). For instance, if you want to install the CLI for Sahara, do the following:

    $ sudo pip install python-sahara

Independently of the CLIs you decide to install or not, it is very convenient you install the [Openstack Client](http://docs.openstack.org/cli-reference/content/openstackclient_commands.html) (also known as Unified CLI):

    $ sudo pip install python-openstackclient

As said, the above clients wrap the Openstack REST APIs; you could also use the REST APIs for adminsitrating Openstack, but the CLI is easier to use since most of the configuration has not to be given each time an operation is performed, but configured in a file or added as environment variables. For instance, this configuration is valid for the admin user when using the Openstack Client:

    $ export OS_IDENTITY_API_VERSION=3
    $ export OS_AUTH_URL=`[`http://localhost:5000/v3`](http://localhost:5000/v3)
    $ export OS_DEFAULT_DOMAIN=default
    $ export OS_USERNAME=admin
    $ export OS_PASSWORD=xxxxxxxx
    $ export OS_PROJECT_NAME=admin

Example of usage:

    $ openstack user list --os-auth-url http://localhost:5000/v3 --os-username admin --os-project-name admin --debug --os-user-domain-name default --os-project-domain-name default --os-identity-api-version 3 --os-password xxxxxxxx

[Top](top)