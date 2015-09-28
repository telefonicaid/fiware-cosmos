#<a name="top"></a>Cygnus

Content:<br>

* [Introduction](#section1)
* [Installation](#section2)
* [Configuration](#section3)
* [Running](#section4)
* [Administration](#section5)

##<a name="section1"></a>Introduction

Cygnus is a connector in charge of persisting [Orion](http://github.com/telefonicaid/fiware-orion) context data in certain configured third-party storages (HDFS among them), creating a historical view of such data. In other words, Orion only stores the last value regarding an entity's attribute, and if an older value is required then you will have to persist it in other storage, value by value, using Cygnus.

Fully detailed information about Cygnus can be found at [Github](http://github.com/telefonicaid/fiware-cygnus). Of special interest are:

* The [README](http://github.com/telefonicaid/fiware-cygnus/blob/master/README.md), containing an extended version of the installation, configuration and administration guide within this document.
* The [documentation folder](http://github.com/telefonicaid/fiware-cygnus/tree/master/doc), containing advanced functionalities description.
* The [Quick Start Guide](http://github.com/telefonicaid/fiware-cygnus/blob/master/doc/quick_start_guide.md), for those willing to run Cygnus right now.

[Top](#top)

##<a name="section2"></a>Installation

Please, refer to the [installation section](http://github.com/telefonicaid/fiware-cygnus/blob/master/README.md#installing-cygnus) of the README at Github.

[Top](#top)

##<a name="section3"></a>Configuration

Please, refer to the [configuration section](http://github.com/telefonicaid/fiware-cygnus/blob/master/README.md#running-cygnus) of the README at Github.

[Top](#top)

##<a name="section4"></a>Running

Please, refer to the [running section](http://github.com/telefonicaid/fiware-cygnus/blob/master/README.md#running-cygnus) of the README at Github.

[Top](#top)

##<a name="section5"></a>Administration

Please, refer to the [Management Interface](http://github.com/telefonicaid/fiware-cygnus/blob/master/doc/design/management_interface.md) specific document at Github.

[Top](#top)
