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
const arrRoomInitial = [];
io.on('connection', function (socket) {
    // console.log('User connect to server: ', socket.id);
    // console.log('room: ', socket.adapter.rooms);
    arrRoomInitial.push(socket.id);
    socket.on('disconnect', function () {
        for (let i = 0; i < arrRoomInitial.length; i++) {
            if (arrRoomInitial[i] === socket.id) {
                arrRoomInitial.splice(i, 1);
                break;
            }
        }
        console.log(socket.id + ' has disconnected to server');
    });
    socket.on('tao-room', function(data) {
        socket.join(data);
        if (socket.Phong) {
            socket.leave(socket.Phong);
            delete socket.Phong;
        }
        socket.Phong = data;
        const listRoom = socket.adapter.rooms;
        const MangRoom= [];
        listRoom.forEach(function(person, tenPhong) {
            let tenPhongInitial;
            person.forEach(function(item) {
                tenPhongInitial = item;
            });
            if (!arrRoomInitial.includes(tenPhong)) {
                MangRoom.push(tenPhong);
            }
        });
        io.sockets.emit('server-send-rooms', MangRoom);
        socket.emit('server-send-room-socket', data);
        console.log('room: ', socket.adapter.rooms);
    });
    socket.on('user-chat', function(data){
        // Chat trong 1 phong
        io.sockets.in(socket.Phong).emit('server-chat', data);
    });
    socket.on('chuyen-room', function(data) {
        if (socket.Phong) {
            socket.leave(socket.Phong);
            delete socket.Phong;
        }
        if (data.targetRoom) {
            socket.join(data.targetRoom);
            socket.Phong = data.targetRoom;
        }
        if (data.currentRoom) {
            socket.leave(data.currentRoom);
        }
        socket.emit('server-send-room-socket', data.targetRoom);
        console.log('chuyen room: ', socket.adapter.rooms);
    });
});

app.get('/', (req, res) => {
    res.render('trangchu');
});
