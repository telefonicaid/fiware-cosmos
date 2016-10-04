#Using Tidoop REST API
Content:

* [`GET /tidoop/v1/version`](#section1)
* [`POST /tidoop/v1/user/{userId}/jobs`](#section2)
* [`GET /tidoop/v1/user/{userId}/jobs`](#section3)
* [`GET /tidoop/v1/user/{userId}/jobs/{jobId}`](#section4)
* [`DELETE /tidoop/v1/user/{userId}/jobs/{jobId}`](#section5)

NOTE: A `X-Auth-Token` header has been included in all the requests assuming the API is protected by means of some kind of token-based authentication mechanism, such as [OAUth2](http://oauth.net/2/).

##<a name="section1"></a>`GET /tidoop/v1/version`
Gets the running version of cosmos-tidoop.

Request example:

```
GET http://<tidoop_host>:<tidoop_port>/tidoop/v1/version HTTP/1.1
X-Auth-Token: 3bzH35FFLdapMgVCOdpot23534fa8a
```

Response example:

```
HTTP/1.1 200 OK

{
    "success": "true",
    "version": "0.2.0-next"
}
```

[Top](#top)

##<a name="section2"></a>`POST /tidoop/v1/user/{userId}/jobs`
Runs a MapReduce job given the following parameters:

* Java jar containing the desired MapReduce application.
* The name of the MapReduce application.
* Arguments as a Json array (i.e. arguments separated by white spaces, enclosed by `[...]`). Leave it empty (`""`) if no arguments are required apart from the input and the output directories.

Please observe if any of the arguments refers to a HDFS path (e.g. input or output directory), the absolute path including the HDFS endpoint is required.

Request example:

```
POST http://computing.cosmos.lab.fiware.org:12000/tidoop/v1/user/frb/jobs HTTP/1.1
Content-Type: application/json
X-Auth-Token: 3bzH35FFLdapMgVCOdpot23534fa8a

{
	"jar": "/usr/lib/hadoop-mapreduce/hadoop-mapreduce-examples.jar",
	"class_name": "wordcount",
	"args": ["hdfs://storage.cosmos.lab.fiware.org/user/frb/input","hdfs://storage.cosmos.lab.fiware.org/user/frb/output"]
}
```

Response example:

```
HTTP/1.1 200 OK

{
    "success": "true",
    "job_id": "job_1460639183882_0005"
}
```

[Top](#top)

##<a name="section3"></a>`GET /tidoop/v1/user/{userId}/jobs`
Gets the details for all the MapReduce jobs run by the given user ID.

Request example:

```
GET http://computing.cosmos.lab.fiware.org:12000/tidoop/v1/user/frb/jobs HTTP/1.1
X-Auth-Token: 3bzH35FFLdapMgVCOdpot23534fa8a
```

Response example:

```
HTTP/1.1 200 OK

{
	"success": "true",
	"jobs": [{
		"job_id": "job_1460639183882_0005",
		"state": "SUCCEEDED",
		"start_time": "1460963556383",
		"user_id": "frb"
	}, {
		"job_id": "job_1460639183882_0004",
		"state": "SUCCEEDED",
		"start_time": "1460959583838",
		"user_id": "frb"
	}]
}
```

[Top](#top)

##<a name="section4"></a>`GET /tidoop/v1/user/{userId}/jobs/{jobId}`
Gets the details for the given MapReduce job run by the given user ID.

Request example:

```
GET http://computing.cosmos.lab.fiware.org:12000/tidoop/v1/user/frb/jobs/job_1460639183882_0005 HTTP/1.1
X-Auth-Token: 3bzH35FFLdapMgVCOdpot23534fa8a
```

Response example:

```
HTTP/1.1 200 OK

{
	"success": "true",
	"job": {
		"job_id": "job_1460639183882_0005",
		"state": "SUCCEEDED",
		"start_time": "1460963556383",
		"user_id": "frb",
		"stderr": "...",
		"stdout": "..."
	}
}
```

Please observe when getting details about a specific job, the `stderr` and `stdout` traces are returned.

[Top](#top)

##<a name="section5"></a>`DELETE /tidoop/v1/user/{userId}/jobs/{jobId}`
Deletes the given MapReduce job run by the given user ID.

Request example:

```
DELETE http://computing.cosmos.lab.fiware.org:12000/tidoop/v1/user/frb/jobs/job_1460639183882_0005 HTTP/1.1
X-Auth-Token: 3bzH35FFLdapMgVCOdpot23534fa8a
```

Response example:

```
HTTP/1.1 200 OK

{
    "success": "true"
}
```

[Top](#top)
