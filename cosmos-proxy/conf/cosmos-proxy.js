<script>
var proxy = {
  "host": "0.0.0.0",
  "port": "14000",
  "target": {
    "host": "0.0.0.0",
    "port": "41000"
  },
  "idm": {
    "host": "account.lab.fiware.org",
    "port": "443"
  },
  "public_paths_list" : [
    "opendata",
    "public"
  ],
  "superuser": "hdfs",
  "log": {
    "file_name": "/var/log/cosmos/cosmos-proxy/cosmos-proxy.log",
    "date_pattern": ".dd-MM-yyyy"
  },
  "cache_file": "/etc/cosmos/cosmos-proxy/cache-dump.json"
}
</script>
