#<a name="top"></a>Using Hadoop and its ecosystem

Content:<br>

* [MapReduce](#section1)
    * [MapReduce for beginners](#section1.1)
        * [Input split details](#section1.1.1)
        * [Mapper details](#section1.1.2)
        * [Reducer details](#section1.1.3)
        * [Output details](#section1.1.4)
        * [Combiners](#section1.1.5)
        * [More details on the key-value pairs](#seciton1.1.6)
    * [Programming a MapReduce job](#section1.2)
        * [Driver code example](#section1.2.1)
        * [Mapper code example](#section1.2.2)
        * [Reducer code example](#section1.2.3)
        * [Compilation](#section1.2.4)
    * [Uploading and running MapReduce jobs](#section1.3)
    * [Running a Tidoop MapReduce job](#section1.4)
    * [Programming a MapReduce job consuming CKAN data](#section1.5)
* [Hive](#section2)
    * [Hive CLI](#section2.1)
    * [Programming a custom Hive client](#section2.2)
        * [Java](#section2.2.1)
        * [Python](#section2.2.2)
* [Oozie](#section3)
    * [Oozie CLI](#section3.1)
    * [Oozie workflow](#section3.2)
    * [Programming a custom Oozie client](#section3.3)
        * [Java](#section3.3.1)

##<a name="section1"></a>MapReduce

###<a name="section1.1"></a>MapReduce for beginners

MapReduce is the programming paradigm used by Hadoop for large data analysis. It basically applies the divide-and-conquer strategy within a distributed cluster of machines:

1. The original input data is splitted into many chunks (the chunk size is the Hadoop block size, by default 64 MB).
2. A process is run for each data chunk, in a distributed/parallel fashion and executing each process the same transformation or filtering function on the partial input data. Some partial output data is generated. These processes are named "mappers".\
3. One or more processes are run in charge of receiving the output of the mappers and executing each process the same aggregation or joining function. These processes are named "reducers". The number of reducers is calculated by Hadoop.

[Top](#top)

####<a name="section1.1.1"></a>Input split details

The configured `InputFormat class governs how a large data file is splitted into blocks, and how those blocks are read. By default `FileInputFormat class is used, and an `InputSplit object is created per each stored HDFS data block. A `RecordReader function is given with the `InputSplit object.

Both `InputSplit and `RecordReader are transparent concepts, and the programmer only needs to specify a standard input format from the following ones:

* `FileInputFormat`
* `TextInputFormat`
* `KeyValueTextInputFormat`
* `SequenceFileInputFormat`
* `SequenceFileAsTextInputFormat`
* `A custom one`

[Top](#top)

####<a name="section1.1.2"></a>Mapper details

As said, a mapper is in charge of reading and processing a complete `InputSplits`. It is read line by line by invoking the `RecordReader    function, which provides a key-value pair about the relative position of the line within the split (key) and the data line itself (value).

Once performed the transformation or filtering function on the input line, another key-value pair is outputted. As can be guessed, the value is the transformed or filtered value. The key is decided by the mapping function depending on the application logic; it may be a constant value or tag about the type of transformed data. It is very important to correctly decide the outputted key because it is used to send lists of key-value pair sharing the same key to the reducers.

[Top](#top)

####<a name="section1.1.3"></a>Reducer details

The reducers receive each one a list of key-value pairs outputted by the mappers, sharing all the pairs the same key. The list is iterated in order to perform a certain aggregation or joining function, the same with all the reducers, and another key-value pair is returned. As you may guess, the value regards to the computed aggregation, and the key depends on the application logic; it usually is equals to the shared key among the received list of key-value pairs, but it can be a very different one if your application requires it.

The number of reducers is chosen by Hadoop depending on several parameters and configurations; more details about the number of mappers and reducers can be found [here](http://wiki.apache.org/hadoop/HowManyMapsAndReduces).

[Top](#top)

####<a name="section1.1.4"></a>Output details

The configured `OutputFormat    class governs how the reducer results are written into HDFS. By default, `FileOutputFormat    provides a `RecordWriter    function that serializes the key-value pair into a HDFS file using a whitespace between key and value.

The resulting output will be composed by several files of serialized data, one per each reducer.

Other serialization formats can be used apart from Hadoop ones:

* Thrift
* Protocol Buffers
* Avro

[Top](#top)

####<a name="section1.1.5"></a>Combiners

[Top](#top)

####<a name="section1.1.6"></a>More details on the key-value pairs

The key-value pairs exchanged all along the MapReduce process have the following properties:

* Values implement the Writable interface.
* Keys implement WritableComparable.
* Some out-of-the-box Hadoop classes: IntWritable, LongWritable, FloatWritable, DoubleWritable...

[Top](#top)

###<a name="section1.2"></a>Programming a MapReduce job

A MapReduce job in Hadoop consists of:

* A driver, a piece of software where to define inputs, outputs, formats, etc. and the entry point for launching the job.
* A set of Mappers, given by a piece of software defining its behaviour.
* A set of Reducers, given by a piece of software defining its behaviour.

From here on, Java language will be assumed since it is the native language for Hadoop. Nevertheless, other programming languages may be used thanks to the [Hadoop streaming feature](http://hadoop.apache.org/docs/current/hadoop-streaming/HadoopStreaming.html).

[Top](#top)

####<a name="section1.2.1"></a>Driver code example

The following example, taken from [tidoop-mr-lib](http://github.com/telefonicaid/fiware-tidoop/tree/develop/tidoop-mr-lib), shows the look and feel of a MapReduce driver.

As can be seen, the driver is a Java class containing a main function that extends the `Configured    class and implements the `Tool    interface. Because of the interface implementation, it is possible to invoke the static method `run    from `ToolRunner`, which is used to run classes implementing such an interface. It parses the generic Hadoop command line arguments (e.g. `-libjars`) and modifies the `Configuration    of the `Tool`. The application specific options are passed along without being modified.

In this particular case, the `run    method implementations starts by checking the application parameters, showing the correct usage if some error is found. Then, the `Configuration    object is taken and one of the application parameters, the regular expression defining the filtering criteria, is added to the configuration; this is because the mapper needs to know such a parameter, and it only has access to the `Configuration    object.

Once the parameters are checked and added to the configuration, the job may start. It is created as an instance of the `Job    class, and several sets are applied in order to define its behaviour:

* The number of reducers is set to 1; this is due to a particular constraint regarding this example, and it is not a necessary step in general.
* The Java jar containing the application is set given the application class name. This is a mandatory step since Hadoop will try to find everything else (mappers, reducers, other auxiliary classes) within the given Java jar.
* The mapper, the combiner and the reducer classes must be always set.
* The key and value classes for the mapper output must be given.
* The same occurs for the key and value classes for the reducer.

Finally, the input and output paths (it is mandatory these paths are about folders, not files) are configured and the MapReduce job is launched.

    /**
     * Copyright 2015 Telefonica Investigación y Desarrollo, S.A.U
     *
     * This file is part of fiware-tidoop (FI-WARE project).
     *
     * fiware-tidoop is free software: you can redistribute it and/or modify it under the terms of the GNU Affero
     * General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your
     * option) any later version.
     * fiware-tidoop is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the
     * implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
     * for more details.
     *
     * You should have received a copy of the GNU Affero General Public License along with fiware-tidoop. If not, see
     * http://www.gnu.org/licenses/.
     *
     * For those usages not covered by the GNU Affero General Public License please contact with
     * francisco.romerobueno at telefonica dot com
     */

    package com.telefonica.iot.tidoop.mrlib.jobs;

    import com.telefonica.iot.tidoop.mrlib.combiners.LinesCombiner;
    import com.telefonica.iot.tidoop.mrlib.mappers.LineFilter;
    import com.telefonica.iot.tidoop.mrlib.reducers.LinesJoiner;
    import com.telefonica.iot.tidoop.mrlib.utils.Constants;
    import java.io.IOException;
    import java.util.regex.Matcher;
    import java.util.regex.Pattern;
    import org.apache.hadoop.conf.Configuration;
    import org.apache.hadoop.conf.Configured;
    import org.apache.hadoop.fs.Path;
    import org.apache.hadoop.io.NullWritable;
    import org.apache.hadoop.io.Text;
    import org.apache.hadoop.mapreduce.Job;
    import org.apache.hadoop.mapreduce.Mapper;
    import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
    import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
    import org.apache.hadoop.util.Tool;
    import org.apache.hadoop.util.ToolRunner;

    /**
     *
     * @author frb
     */
    public final class Filter extends Configured implements Tool {

       /**
        * Main class.
        * @param args
        * @throws Exception
        */
       public static void main(String[] args) throws Exception {
           int res = ToolRunner.run(new Configuration(), new Filter(), args);
           System.exit(res);
       } // main

       @Override
       public int run(String[] args) throws Exception {
           // check the number of arguments, show the usage if it is wrong
           if (args.length != 3) {
               showUsage();
               return -1;
           } // if

           // get the arguments
           String input = args[0];
           String output = args[1];
           String regex = args[2];

           // create and configure a MapReduce job
           Configuration conf = this.getConf();
           conf.set(Constants.PARAM_REGEX, regex);
           Job job = Job.getInstance(conf, "tidoop-mr-lib-filter");
           job.setNumReduceTasks(1);
           job.setJarByClass(Filter.class);
           job.setMapperClass(LineFilter.class);
           job.setCombinerClass(LinesCombiner.class);
           job.setReducerClass(LinesJoiner.class);
           job.setMapOutputKeyClass(Text.class);
           job.setMapOutputValueClass(Text.class);
           job.setOutputKeyClass(NullWritable.class);
           job.setOutputValueClass(Text.class);
           FileInputFormat.addInputPath(job, new Path(input));
           FileOutputFormat.setOutputPath(job, new Path(output));

           // run the MapReduce job
           return job.waitForCompletion(true) ? 0 : 1;
       } // main

       private void showUsage() {
           System.out.println("Usage:");
           System.out.println();
           System.out.println("hadoop jar \");
           System.out.println("   target/tidoop-mr-lib-x.y.z-jar-with-dependencies.jar \");
           System.out.println("   com.telefonica.iot.tidoop.mrlib.Filter \");
           System.out.println("   -libjars target/tidoop-mr-lib-x.y.z-jar-with-dependencies.jar \");
           System.out.println("   <HDFS input> \");
           System.out.println("   <HDFS output> \");
           System.out.println("   <regex>");
       } // showUsage

    } // Filter

[Top](#top)

####<a name="1.2.2"></a>Mapper code example

A mapper must extend the `Mapper class and override at least the `map method with an implementation of the desired mapping function. In the example below, the mapping function is about filtering or not a text line based on the existence of a certain string (defined through a regular expression) within the text line. Such a regular expression was passed in the `Configuration object, as explained before, and it must be retrieved in an implementation of the `setup method, since the `map    method has not access to the configuration.

Please observe the types for the input and output key-value pairs. A `(Object,Text) pair is passed to the `map method, as a result of (transparently) invoking the `RecordReader method from `FileInputSplit class. This pair, as already explained, contains the relative position of the read text line within the split or data block. A `(Text,Text) pair is outputted as the result of the map function, in this particular case containing a constant key (`"common-key"`) and the input text line if it was not filtered; the reason for using this constant key is that all the outputted pairs are sent to the same single reducer.

    /**
     * Copyright 2015 Telefonica Investigación y Desarrollo, S.A.U
     *
     * This file is part of fiware-tidoop (FI-WARE project).
     *
     * fiware-tidoop is free software: you can redistribute it and/or modify it under the terms of the GNU Affero
     * General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your
     * option) any later version.
     * fiware-tidoop is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the
     * implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
     * for more details.
     *
     * You should have received a copy of the GNU Affero General Public License along with fiware-tidoop. If not, see
     * http://www.gnu.org/licenses/.
     *
     * For those usages not covered by the GNU Affero General Public License please contact with
     * francisco.romerobueno at telefonica dot com
     */

    package com.telefonica.iot.tidoop.mrlib.mappers;

    import java.io.IOException;
    import org.apache.hadoop.io.Text;
    import org.apache.hadoop.mapreduce.Mapper;

    /**
     *
     * @author frb
     */

    /**
     * LineFilter.
     */
    public static class LineFilter extends Mapper<Object, Text, Text, Text> {

       private Pattern pattern = null;
       private final Text commonKey = new Text("common-key");

       @Override
       public void setup(Context context) throws IOException, InterruptedException {
           // compile just once the regex; use an empty regex if no one is provided
           pattern = Pattern.compile(context.getConfiguration().get(Constants.PARAM_REGEX, ""));
       } // setup

       @Override
       public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
           Matcher matcher = pattern.matcher(value.toString());

           if (matcher.matches()) {
               context.write(commonKey, value);
           } // if
       } // map

    } // LineFilter

[Top](#top)

####<a name="1.2.3"></A>Reducer code example

A reducer must extend the `Reducer class and override at least the `reduce method with an implementation of the desired reducing function. In the example below, the reducing function is about emitting to the output all the received pairs.

Please observe the types for the input and output key-value pairs. Several `(Text,Text) pairs are passed as an iterable object to the `reduce method; these are the pairs the mappers outputted in the previous step of the algorithm. Several `(NullWritable,Text) pairs are outputted as the result of the reduce function; the usage of `NullWritable is due to we do not want a key to be serialized in the final HDFS file containing the whole result of the filtering process. Finally, the `FileOutputFormat`, through the `RecordWriter method, serializes each one of the resulting pairs in a single HDFS file, since
only one reducer has been setup.

    /**
     * Copyright 2015 Telefonica Investigación y Desarrollo, S.A.U
     *
     * This file is part of fiware-tidoop (FI-WARE project).
     *
     * fiware-tidoop is free software: you can redistribute it and/or modify it under the terms of the GNU Affero
     * General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your
     * option) any later version.
     * fiware-tidoop is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the
     * implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
     * for more details.
     *
     * You should have received a copy of the GNU Affero General Public License along with fiware-tidoop. If not, see
     * http://www.gnu.org/licenses/.
     *
     * For those usages not covered by the GNU Affero General Public License please contact with
     * francisco.romerobueno at telefonica dot com
     */

    package com.telefonica.iot.tidoop.mrlib.reducers;

    import java.io.IOException;
    import org.apache.hadoop.io.NullWritable;
    import org.apache.hadoop.io.Text;
    import org.apache.hadoop.mapreduce.Reducer;

    /**
     *
     * @author frb
     */

    /**
     * LinesJoiner.
     */
    public class LinesJoiner extends Reducer<Text, Text, NullWritable, Text> {

       @Override
       public void reduce(Text key, Iterable<Text> filteredLines, Context context)
           throws IOException, InterruptedException {
           for (Text filteredLine : filteredLines) {
               context.write(NullWritable.get(), filteredLine);
          } // for
      } // reduce

    } // LinesJoiner

[Top](#top)

####<a name="section1.2.4"></A>Compilation

Once the above classes have been coded, just compile them and create a *jar* file. Any modern IDE for Java will do that for you. Anyway, and supposing the source files are in a *src* folder, the destination for the compiled classes is *classes* and the destination for the *jar* file is *dist*, the following Java commands should be enough to create everything:

    $ rm dist/*
    $ rm classes/es/tid/*
    $ javac -classpath <path_to_hadoop_core_jar> -d classes/ src/*.java
    $ jar -cvf dist/<my_app>.jar -C classes/ .

The created *jar* should be automatically distributed by Hadoop to all the cluster nodes when invoked (see the *Uploading and running MapReduce jobs* section in this wiki). You can also copy it to somewhere in the Hadoop classpath by yourself, for instance:

    $ cp dist/word-count.jar /usr/lib/hadoop/lib

[Top](#TOP)

###<a name="section1.3"></a>Uploading and running MapReduce jobs

Hadoop MapReduce jobs are written in Java and packaged as Java jar files; this section will explain how to execute those jobs by specifying the folder containing the input data files and the location where the results are expected to be available. Both folders will be placed under the HDFS userspace; the input folder must exist before the execution, but the output folder is created once the job has finished. For instance:

    $ hadoop fs -ls /user/myuserspace
    Found 2 items
    drwxr-----   - myuserspace myuserspace      0 2015-07-09 12:04 /user/frb/.staging
    drwxr-xr-x   - myuserspace myuserspace      0 2013-06-21 09:41 /user/myuserspace/input
    $ hadoop fs -ls /user/myuserspace/input
    Found 1 items
    -rw-r--r--   3 myuserspace myuserspace   1234 2013-06-21 09:41 /user/myuserspace/input/mydatafile.txt
    $ hadoop fs -cat /user/myuserspace/input/mydatafile.txt
    these are some lines of data
    this is not real data
    but it is useful for demostration purposes
    these are some lines of data
    this is not real data
    but it is useful for demostration purposes
    these are some lines of data
    this is not real data
    but it is useful for demostration purposes
    ...

Assuming we want to run the Filter application from [tidoop-mr-lib](http://github.com/telefonicaid/fiware-tidoop/tree/develop/tidoop-mr-lib#filter) just for demonstration purposes, this would be the output after typing the following command:

    $ hadoop jar target/tidoop-mr-lib-0.0.0-SNAPSHOT-jar-with-dependencies.jar com.telefonica.iot.tidoop.mrlib.jobs.Filter -libjars target/tidoop-mr-lib-0.0.0-SNAPSHOT-jar-with-dependencies.jar input output ^.*\bdata\b.*$
    15/08/11 16:02:59 INFO impl.TimelineClientImpl: Timeline service address: http://dev-fiwr-bignode-12.hi.inet:8188/ws/v1/timeline/
    15/08/11 16:02:59 INFO client.RMProxy: Connecting to ResourceManager at dev-fiwr-bignode-12.hi.inet/10.95.236.44:8050
    15/08/11 16:03:00 INFO input.FileInputFormat: Total input paths to process : 1
    15/08/11 16:03:01 INFO mapreduce.JobSubmitter: number of splits:1
    15/08/11 16:03:01 INFO mapreduce.JobSubmitter: Submitting tokens for job: job_1438089170493_0002
    15/08/11 16:03:01 INFO impl.YarnClientImpl: Submitted application application_1438089170493_0002
    15/08/11 16:03:01 INFO mapreduce.Job: The url to track the job: http://dev-fiwr-bignode-12.hi.inet:8088/proxy/application_1438089170493_0002/
    15/08/11 16:03:01 INFO mapreduce.Job: Running job: job_1438089170493_0002
    15/08/11 16:03:08 INFO mapreduce.Job: Job job_1438089170493_0002 running in uber mode : false
    15/08/11 16:03:08 INFO mapreduce.Job:  map 0% reduce 0%
    15/08/11 16:03:13 INFO mapreduce.Job:  map 100% reduce 0%
    15/08/11 16:03:19 INFO mapreduce.Job:  map 100% reduce 100%
    15/08/11 16:03:20 INFO mapreduce.Job: Job job_1438089170493_0002 completed successfully
    15/08/11 16:03:20 INFO mapreduce.Job: Counters: 49
       File System Counters
           FILE: Number of bytes read=6
           FILE: Number of bytes written=204841
           FILE: Number of read operations=0
           FILE: Number of large read operations=0
           FILE: Number of write operations=0
           HDFS: Number of bytes read=1924
           HDFS: Number of bytes written=0
           HDFS: Number of read operations=6
           HDFS: Number of large read operations=0
           HDFS: Number of write operations=2
       Job Counters
           Launched map tasks=1
           Launched reduce tasks=1
           Rack-local map tasks=1
           Total time spent by all maps in occupied slots (ms)=3659
           Total time spent by all reduces in occupied slots (ms)=3497
           Total time spent by all map tasks (ms)=3659
           Total time spent by all reduce tasks (ms)=3497
           Total vcore-seconds taken by all map tasks=3659
           Total vcore-seconds taken by all reduce tasks=3497
           Total megabyte-seconds taken by all map tasks=14987264
           Total megabyte-seconds taken by all reduce tasks=14323712
       Map-Reduce Framework
           Map input records=57
           Map output records=0
           Map output bytes=0
           Map output materialized bytes=6
           Input split bytes=138
           Combine input records=0
           Combine output records=0
           Reduce input groups=0
           Reduce shuffle bytes=6
           Reduce input records=0
           Reduce output records=0
           Spilled Records=0
           Shuffled Maps =1
           Failed Shuffles=0
           Merged Map outputs=1
           GC time elapsed (ms)=25
           CPU time spent (ms)=1100
           Physical memory (bytes) snapshot=1407291392
           Virtual memory (bytes) snapshot=8527355904
           Total committed heap usage (bytes)=1702363136
       Shuffle Errors
           BAD_ID=0
           CONNECTION=0
           IO_ERROR=0
           WRONG_LENGTH=0
           WRONG_MAP=0
           WRONG_REDUCE=0
       File Input Format Counters
           Bytes Read=1786
       File Output Format Counters
           Bytes Written=0

Notice the command is structured as:

    hadoop jar <jar_file> <main_class> <existing_input_folder> <non_existing_output_folder>

Once the job has finished (a real job may take several hours or days to complete its task), the results can be found in the specified output folder:

    $ hadoop fs -ls output
    Found 2 items
    -rw-r--r--   3 myuserspace myuserspace      0 2015-08-11 16:03 output/_SUCCESS
    -rw-r--r--   3 myuserspace myuserspace    969 2015-08-11 16:03 output/part-r-00000

Since the Filter application is setup to run a single reducer (see previous section), a single `part-r-0000    file appears in the output folder; if more than one reducer would have been setup then a file would have appeared for each one of them. We can show the content of that output file, confirming only the lines containing the word *data* have been maintained:

    $ hadoop fs -cat output/part-r-00000
    these are some lines of data
    this is not real data
    these are some lines of data
    this is not real data
    these are some lines of data
    this is not real data
    ...

[Top](#top)

###<a name="section1.4"></a>Running a Tidoop MapReduce job

Please refer to the [jobs reference](http://github.com/telefonicaid/fiware-tidoop/tree/develop/tidoop-mr-lib#jobs-reference-in-alphabetical-order) section of the README at Github.

[Top](#top)

###<a name="section1.5"></a>Programming a MapReduce job consuming CKAN data

Please refer to the [usage](http://github.com/telefonicaid/fiware-tidoop/tree/develop/tidoop-hadoop-ext#usage) section of the README at Github.

[Top](#top)

##<a name="section2"></a>Hive

Hive is a data warehouse system for Hadoop that facilitates easy data summarization, ad-hoc SQL-like queries, and the analysis of large datasets stored in Hadoop compatible file systems \[4\]. Using Hive no MapReduce programming is needed, since all the MapReduce stuff is automatically done by Hive.

The way Hive works is by loading all the data in SQL-like tables and then allowing for internal (using the Hive cli) or external (using a Java-based Hive client) SQL-like queries written in [HiveQL](http://cwiki.apache.org/confluence/display/Hive/LanguageManual). Then, as already said, almost each time a query is performed a predefined Hive MapReduce job is run in order to select, filter, join, group, etc. the required data. We say *almost each time* because if a simple `select * from table    is performed, no MapReduce job is run (all the data within the table is returned).

[Top](#top)

###<a name="section2.1"></a>Hive CLI

Hive CLI \[6\] must be considered only for testing purposes, or remote executions through Oozie. It can be used by sshing the Head Node using
your credentials and by typing *hive* in a shell:

    $ hive
    $ Hive history file=/tmp/myuser/hive_job_log_opendata_201310030912_2107722657.txt
    $ hive>select column1,column2,otherColumns from mytable where column1='whatever' and columns2 like '%whatever%';
    Total MapReduce jobs = 1
    Launching Job 1 out of 1
    Number of reduce tasks not specified. Estimated from input data size: 1
    In order to change the average load for a reducer (in bytes):
    set hive.exec.reducers.bytes.per.reducer=<number>
    In order to limit the maximum number of reducers:
    set hive.exec.reducers.max=<number>
    In order to set a constant number of reducers:
    set mapred.reduce.tasks=<number>
    Starting Job = job_201308280930_0953, Tracking URL = http://cosmosmaster-gi:50030/jobdetails.jsp?jobid=job_201308280930_0953
    Kill Command = /usr/lib/hadoop/bin/hadoop job  -Dmapred.job.tracker=cosmosmaster-gi:8021 -kill job_201308280930_0953
    2013-10-03 09:15:34,519 Stage-1 map = 0%,  reduce = 0%
    2013-10-03 09:15:36,545 Stage-1 map = 67%,  reduce = 0%
    2013-10-03 09:15:37,554 Stage-1 map = 100%,  reduce = 0%
    2013-10-03 09:15:44,609 Stage-1 map = 100%,  reduce = 33%
    2013-10-03 09:15:45,631 Stage-1 map = 100%,  reduce = 100%
    Ended Job = job_201308280930_0953
    OK

    the result set...

[Top](#top)

###<a name="section2.2"></a>Programming a custom Hive client

Hive server usually runs at the computing services node, and connections from your Hive client will be served in the TCP/10000 port as usual. Please, explore next sections in order to learn how to write your own Hive client in some popular programming languages (Java, Python, etc). Consider this [link](http://cwiki.apache.org/confluence/display/Hive/HiveServer2+Clients) as another useful entry point to write your own Hive clients as well.

[Top](#top)

####<a name="section2.2.1"></a>Java

For the example below, we will assume Hive 0.13.0 has been deployed in the computing services node, and the server run is the HiveServer2 version. In addition, we will assume Maven is being used for building the client.

Thus, first start by adding the following lines to your `pom.xml` in order to solve the dependencies:

    <dependency>
       <groupId>org.apache.hadoop</groupId>
       <artifactId>hadoop-core</artifactId>
       <version>0.20.0</version>
    </dependency>
    <dependency>
       <groupId>org.apache.hive</groupId>
       <artifactId>hive-exec</artifactId>
       <version>0.13.0</version>
    </dependency>
    <dependency>
       <groupId>org.apache.hive</groupId>
       <artifactId>hive-jdbc</artifactId>
       <version>0.13.0</version>
    </dependency>

This is the minimum code:

    import java.sql.Connection;
    import java.sql.ResultSet;
    import java.sql.Statement;
    import java.sql.DriverManager;

    public class HiveClient {

       // JDBC driver required for Hive connections
       private static String driverName = "org.apache.hive.jdbc.HiveDriver";
       private static Connection con;

       private static Connection getConnection(String ip, String port, String db, String user, String password) {
          try {
             // dynamically load the Hive JDBC driver
             Class.forName(driverName);
          } catch (ClassNotFoundException e) {
             System.out.println(e.getMessage());
             return null;
          } // try catch

          try {
             // return a connection based on the Hive JDBC driver
             return DriverManager.getConnection("jdbc:hive2://" + ip + ":" + port + "/" + db, user, password);
          } catch (SQLException e) {
             System.out.println(e.getMessage());
             return null;
          } // try catch
       } // getConnection

       private static void doQuery() {
          try {
             // from here on, everything is SQL!
             Statement stmt = con.createStatement();
             ResultSet res = stmt.executeQuery("select column1,column2,otherColumns "
                + "from mytable where column1='whatever' and columns2 like '%whatever%'");

             // iterate on the result
             while (res.next()) {
                String column1 = res.getString(1);
                Integer column2 = res.getInt(2);

                // whatever you want to do with this row, here
             } // while

             // close everything
             res.close();
             stmt.close();
             con.close();
          } catch (SQLException ex) {
             System.exit(0);
          } // try catch
       } // doQuery

       public static void main(String[] args) {
          // get a connection to the Hive server running on the specified IP address, listening on 10000/TCP port
          // authenticate using my credentials
          con = getConnection("cosmos.lab.fiware.org", "10000", "default", "myuser", "mypasswd");

          // do a query, querying the Hive server will automatically imply the execution of one or more MapReduce jobs
          doQuery();
       } // main

    } // HiveClient

[Top](#top)

####<a name="section2.2.2"></a>Python

For the example below, we will assume Hive 0.13.0 has been deployed in the computing services node, and the server run is the HiveServer2
version. In addition, we will assume [`pip`](http://pypi.python.org/pypi/pip) has been installed as the Python package manager.

Thus, start by installing the [3](http://github.com/BradRuderman/pyhs2) driver for HiveServer2:

    $ pip install pyhs2`

The following code implements a basic Hive client using Python:

    import pyhs2

    with pyhs2.connect(host='cosmos.lab.fiware.org',
                    port=10000,
                    authMechanism="PLAIN",
                    user='myuser',
                    password='mypassword',
                    database='default') as conn:
     with conn.cursor() as cur:
         cur.execute("select * from table")
         print cur.getSchema()

         for i in cur.fetch():
             print i`

[Top](#top)

##<a name="section3"></a>Using Oozie

Oozie is a workflow scheduler system for Apache Hadoop jobs. It allows designing Oozie Workflows, i.e. Directed Acyclical Graphs (DAGs) of actions, which in the end coordinate the execution of the jobs.

An action can be a MapReduce job, a Pig application, a file system task, or a Java application. Flow control in the DAGs is performed by node
elements providing a certain logic based on the input of the preceding task in the graph (e.g. forks, joins, decision nodes), or when an event (time, whatever) triggers. encies have been met.

An example of DAG is the following one:

![Figure 1 - Example of Oozie DAG](oozie_dag.png "Figure 1 - Example of Oozie DAG")

Oozie workflows definitions are written in hPDL (a XML Process Definition Language similar to JBOSS JBPM jPDL). Oozie workflows can be parameterized (using variables like \${inputDir} within the workflow definition). When submitting a workflow job values for the parameters must be provided. If properly parameterized (i.e. using different output directories) several identical workflow jobs can concurrently.

Oozie can be used in three ways, command line, Java client API and API REST.

[Top](#top)

###<a name="section3.1"></a>Oozie CLI

In order to use Oozie through commands, it is necessary to install the Oozie client in a remote machine. This client will be able to talk with the Oozie server already installed in the cluster (TCP/11000 port). This [official guidelines](http://oozie.apache.org/docs/4.0.0/DG_QuickStart.html#Client_Installation) will help you to install it.

Once the client has been setup, you can schedule your jobs by following this other [guidelines](http://oozie.apache.org/docs/4.0.0/DG_Examples.html#Command_Line_Examples). Basically, you have to type a command like this one:

    $ oozie job -oozie http://<master-node>:11000/oozie -config examples/apps/map-reduce/job.properties -run

If everything goes well, a job identifier is printed. As can be seen, you must specify the Master Node IP address or hostname, and the path to the Oozie application you want to run (in the above command, we are using the examples given with the Oozie distribution).

The oozie command can provide per job status information as well:

    $ oozie job -oozie http://<master-node>:11000/oozie -info <job-identifier>
    Job ID : 0000014-140116081225611-oozie-oozi-W
    ------------------------------------------------------------------------------------------------------------------------------------
    Workflow Name : map-reduce-wf
    App Path      : hdfs://<name-node>:8020/user/<user>/examples/apps/map-reduce/workflow.xml
    Status        : RUNNING
    Run           : 0
    User          : <user>
    Group         : users
    Created       : 2014-01-16 16:53
    Started       : 2014-01-16 16:53
    Last Modified : 2014-01-16 16:53
    Ended         : -

    Actions
    ------------------------------------------------------------------------------------------------------------------------------------
    ID                                                                            Status    Ext ID                 Ext Status Err Code
    ------------------------------------------------------------------------------------------------------------------------------------
    0000014-140116081225611-oozie-oozi-W@mr-node                                  RUNNING   job_201401151554_0032  RUNNING    -
    ------------------------------------------------------------------------------------------------------------------------------------`

Oozie applications consists of a well-known structured directories containing:

* **lib/**, a directory containing the MR job jar, needed libraries, etc.
* **workflow.xml**, the workflow definition written in hPDL.
* **job.properties**, the values for the parameters used in the workflow definition.

The programming guide will provide guidelines about how to create your own Oozie applications.

[Top](#top)

###<a name="section3.2"></a>Oozie workflow

Writing Oozie workflows can be a hard task, but in a few words it is necessary to generate a XML document as the one below, containing a list of flow control nodes (e.g. start, kill, end) and actions to be executed. Flow control nodes and actions may be parameterized in the
`job.properties` file. This file must be called `workflow.xml` and must be included in the application folder.

    <workflow-app name="wordcount-wf" xmlns="uri:oozie:workflow:0.1">
     <start to="wordcount"/>
     <action name="wordcount">
         <map-reduce>
             <job-tracker>${jobTracker}</job-tracker>
             <name-node>${nameNode}</name-node>
             <configuration>
                 <property>
                     <name>mapred.mapper.class</name>
                     <value>org.myorg.WordCount.Map</value>
                 </property>
                 <property>
                     <name>mapred.reducer.class</name>
                     <value>org.myorg.WordCount.Reduce</value>
                 </property>
                 <property>
                     <name>mapred.input.dir</name>
                     <value>${inputDir}</value>
                 </property>
                 <property>
                     <name>mapred.output.dir</name>
                     <value>${outputDir}</value>
                 </property>
             </configuration>
         </map-reduce>
         <ok to="end"/>
         <error to="end"/>
     </action>
     <kill name="kill">
         <message>Something went wrong: ${wf:errorCode('wordcount')}</message>
     </kill/>
     <end name="end"/>
    </workflow-app>

All the detailed documentation can be found [here](http://archive.cloudera.com/cdh/3/oozie/WorkflowFunctionalSpec.html).

Once a workflow is written, it is ready to be executed with the Oozie client as described in the *Using Oozie* section. Only if you a need a custom mechanism to run the workflows, the Java client API and the API REST are recommended (see next sections).

[Top](#top)

###<a name="section3.3"></a>Programming a custom Oozie client

Oozie provides a Java API for custom Java clients development. There is a step-by-step example in this [official link](http://oozie.apache.org/docs/4.0.0/DG_Examples.html#Java_API_Example).

Additionally, the [API REST](http://oozie.apache.org/docs/4.0.0/WebServicesAPI.html) for Oozie allows you for submitting and running workflows in a REST fashion.

The programming section of this document will explain you how to create an application taking advantage both of the Oozie API and the Oozie REST API.

[Top](#top)

####<a name="section3.3.1"></a>Java

Oozie provides a Java API for custom Java clients development. There is a step-by-step example in this [official link](http://oozie.apache.org/docs/4.0.0/DG_Examples.html#Java_API_Example) which is summarized here.

Add the following lines to your Maven based pom.xml in order to solve the dependencies:

    <repositories>
    <repository>
       <id>cloudera</id>
       <url>https://repository.cloudera.com/artifactory/cloudera-repos/</url>
    </repository>
    </repositories>

    <dependencies>
    ...
    <dependency>
       <groupId>com.yahoo.oozie</groupId>
       <artifactId>oozie-client</artifactId>
       <version>2.3.2-cdh3u6</version>
    </dependency>
    </dependencies>

This is the minimum code:

    package com.mycompany.oozieclienttest;

    import java.util.logging.Level;
    import java.util.logging.Logger;
    import org.apache.oozie.client.OozieClient;
    import org.apache.oozie.client.OozieClientException;
    import org.apache.oozie.client.WorkflowJob;
    import java.util.Properties;

    /**
     * Oozie client test.
     *
     */
    public final class OozieClientTest {

       /**
        *
        */
        private OozieClientTest() {
        } // OozieClientTest

       /**
        *
        * @param args
        */
        public static void main(String[] args) {
          // get a OozieClient for local Oozie
          OozieClient client = new OozieClient("`[`http://130.206.80.46:11000/oozie/`](http://130.206.80.46:11000/oozie/)`");

          // create a workflow job configuration and set the workflow application path
          Properties conf = client.createConfiguration();
          conf.setProperty(OozieClient.APP_PATH, "hdfs://cosmosmaster-gi:8020/user/frb/examples/apps/map-reduce");

          // setting workflow parameters
          conf.setProperty("nameNode", "hdfs://cosmosmaster-gi:8020");
          conf.setProperty("jobTracker", "cosmosmaster-gi:8021");
          conf.setProperty("outputDir", "output-data");
          conf.setProperty("examplesRoot", "examples");
          conf.setProperty("queueName", "default");

          // submit and start the workflow job
          String jobId = null;

          try {
             jobId = client.run(conf);
          } catch (OozieClientException ex) {
             Logger.getLogger(OozieClientTest.class.getName()).log(Level.SEVERE, null, ex);
          } // try catch

          System.out.println("Workflow job submitted");

          try {
             // wait until the workflow job finishes printing the status every 10 seconds
             while (client.getJobInfo(jobId).getStatus() == WorkflowJob.Status.RUNNING) {
                System.out.println("Workflow job running ...");
                Thread.sleep(10 * 1000);
             } // while
          } catch (OozieClientException ex) {
             Logger.getLogger(OozieClientTest.class.getName()).log(Level.SEVERE, null, ex);
          } catch (java.lang.InterruptedException ex) {
             Logger.getLogger(OozieClientTest.class.getName()).log(Level.SEVERE, null, ex);
          } // try catch catch

          // print the final status o the workflow job
          System.out.println("Workflow job completed ...");

          try {
             System.out.println(client.getJobInfo(jobId));
          } catch (OozieClientException ex) {
             Logger.getLogger(OozieClientTest.class.getName()).log(Level.SEVERE, null, ex);
          } // try catch
       } // main
    } // OozieClientTest

[Top](#top)
