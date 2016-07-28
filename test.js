var request = require('request')
var fs = require('fs')
var index = require('./index')

request('http://localhost:3238/', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var file = fs.readFileSync("index.html", "utf8");
    if (file === body) {
      console.log('All good: We could read /')
      process.exit(0)
    } else {
      console.log('ERR: We did not get what we were expecting')
      process.exit(1)
    }
  } else {
    console.log('ERR: Could not get /')
    process.exit(1)
  }
})
