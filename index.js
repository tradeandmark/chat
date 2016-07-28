var app = require('express')()
var express3 = require('express3')
var http = require('http').Server(app)
var io = require('socket.io')(http)

var Colours = [], Users = [];

if (process.env.TM_ISTRAVIS !== 'yes') {
  app.use(express3.basicAuth(process.env.USER || 'trade', process.env.PASS || 'mark'))
}

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get('/styles.css', function(req, res) {
  res.sendFile(__dirname + '/styles.css')
})

io.on('connection', function(socket){
  UserCheck()
  console.log('a user connected')
  io.emit('chat message', '<strong style="color:red">A user connected</strong>')
  socket.on('disconnect', function(){
    UserCheck()
    console.log('user disconnected')
    io.emit('chat message', '<strong style="color:blue">A user disconnected</strong>')
  })
  socket.on('chat message', function(msg){
    UserCheck()
    if (msg.message == '') {
      return
    }
    if (!Colours[msg.user]) {
      var col = '#'+Math.floor(Math.random()*16777215).toString(16)
      Colours[msg.user] = col
    }
    msg.message = msg.message.replace(/script/igm, 'scrip_t').replace(/on/igm, 'o_n')
    console.log('message: ' + msg.message + '(' + msg.user + ')')
    io.emit('chat message', '<strong style="color:' + Colours[msg.user] + '">' + msg.user + '</strong> ' + msg.message)
  })
  socket.on('user active', function (msg) {
    Users.push('<span>' + msg + '</span>')
  })
})

function UserCheck() {
  Users = []
  // console.log('Checking users');
  io.emit('check users', '')
  setTimeout(function () {
    // console.log('Updating users');
    io.emit('users update', Users)
  }, 2000)
}

http.listen(process.env.PORT || 80, function(){
  console.log('listening on *:3000')
})
