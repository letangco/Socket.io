import express from 'express';
import cons from 'consolidate';
const app = express();

app.engine('html', cons.swig)
app.use(express.static('./public'));
app.set('views', './views');
app.set('view engine', 'html');

const server = require('http').Server(app);

import SocketIO from 'socket.io';

const io = SocketIO(server);

server.listen(3000, () => {
    console.log('Server is running at port', 3000);
});

const mangUsers = ["a"];
const interfaceUser = (id, name, pass) => {
    return {
        id: id,
        username: name,
        password: pass
    };
};

io.on('connection', function (socket) {
    console.log('User connect to server: ', socket.id);
    socket.on('disconnect', function () {
        console.log(socket.id + ' has disconnected to server');
    });
    socket.on('client-send-Username', (data) => {
        if (mangUsers.indexOf(data) >= 0) {
            socket.emit('server-send-dang-ki-that-bai');
        } else {
            mangUsers.push(data);
            // Create key, value Username for socket
            socket.Username = data;
            socket.emit('server-send-dang-ki-thanh-cong', data);
            io.sockets.emit('server-send-danh-sach-user', mangUsers);
        }
    });

    socket.on("logout", function () {
        // delete user logout of array
        if (mangUsers.indexOf(socket.Username) > -1) {
            mangUsers.splice(
                mangUsers.indexOf(socket.Username), 1
            );
        }
        socket.broadcast.emit('server-send-danh-sach-user', mangUsers);
    });
    socket.on("user-send-message", function (data) {
        io.sockets.emit("server-send-message", {
            user: socket.Username,
            message: data
        });
    });
    socket.on("toi-dang-go-chu", function(){
        const s = socket.Username + " is typing";
        io.sockets.emit('server-send-user-is-typing', s);
    });
    socket.on("khong-go-chu", function(){
        io.sockets.emit('server-send-user-no-typing');
    });
});

app.get('/', (req, res) => {
    res.render('trangchu');
});

app.get('/register', (req, res) => {
    res.render('dangky');
});