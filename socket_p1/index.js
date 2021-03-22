// Script server will be run
var express = require('express');
var app = express();

app.use(express.static('./public'));

app.set('view engine', 'ejs');
app.set('views', './views');

var server = require('http').Server(app);

var io = require('socket.io')(server);

server.listen(3000);

io.on('connection', function(socket) {
    console.log('User connect to server: ', socket.id);
    socket.on("disconnect", function() {
        console.log(socket.id + ' has disconnected to server');
    });
    socket.on('client-send-data', (data) => {
        console.log(socket.id + ' emitted '+ data);
    });
});

app.get('/', function(req, res) {
    res.render('trangchu');
});