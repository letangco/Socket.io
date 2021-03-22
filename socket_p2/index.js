import express from 'express';
import cons from 'consolidate';
const app = express();

app.engine('html', cons.swig)
app.use(express.static(__dirname + './public'));
app.set('views', './views');
app.set('view engine', 'html');

const server = require('http').Server(app);

import SocketIO from 'socket.io';

const io = SocketIO(server);

server.listen(3000, () => {
    console.log('Server is running at port', 3000);
});

io.on('connection', function(socket) {
    console.log('User connect to server: ', socket.id);
    socket.on('disconnect', function () {
        console.log(socket.id+ ' has disconnected to server');
    });
    socket.on('client-send-data', (data) => {
        console.log(socket.id + ' emitted ' + data);
        // Server phát tín hiệu (emit) tới tất cả client
        io.sockets.emit('Server-send-data-all', data + '888');
        // Server chỉ phát tín hiệu về riêng client
        socket.emit('response-client', data);
        // Server phát tất cả trừ một client đã gửi
        socket.broadcast.emit('exception-client', data);
    });
});

app.get('/', (req, res) => {
    res.render('trangchu');
});
