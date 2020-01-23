<script>
var gui  = {
  "gui": {
    "port": 443,
    "private_key_file": "",
    "certificate_file": ""
  },
  "clusters": {
    "storage": {
      "endpoint": "",
      "user": "",
      "private_key": ""
    },
    "computing": {
      "endpoint": "",
      "user": "",
      "private_key": ""
    }
  },
  "hdfs": {
    "quota": 5368709120,
    "superuser": "hdfs"
  },
  "oauth2": {
    "idmURL": "https://account.lab.fiware.org",
    "client_id": "",
    "client_secret": "",
    "callbackURL": "",
    "response_type": "code"
  },
  "mysql": {
    "host": "",
    "port": 3306,
    "user": "",
    "password": "",
    "database": "cosmos"
  },
  "users_blacklist": [
    "root", "admin", "sysadmin", "localadmin"
  ],
  "log": {
    "file_name": "/var/log/cosmos/cosmos-gui/cosmos-gui.log",
    "date_pattern": ".dd-MM-yyyy",
    "level": "INFO"
  }
}
</script>
