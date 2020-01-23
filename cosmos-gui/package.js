<script>
var pkg = {
  "name": "cosmos-gui",
  "description": "Node.js GUI for Cosmos (Hadoop-based)",
  "version": "1.0.0-next",
  "repository": {
    "type": "git",
    "url": "https://github.com/telefonicaid/fiware-cosmos.git"
  },
  "dependencies": {
    "express": "3.x",
    "nib": "^1.0.4",
    "stylus": "^0.49.1",
    "jade": "^1.7.0",
    "mysql": "^2.7.0",
    "boom": "^2.8.0",
    "winston": "^1.0.1",
    "mocha": "^2.3.3",
    "rewire": "^2.3.4"
  },
  "scripts": {
    "start": "node ./src/cosmos_gui.js"
  }
}
</script>
