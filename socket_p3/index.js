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

const users = [];
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
    socket.on('client-register', (data) => {
        let countLength = 0;
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === data.username) {
                socket.emit('response-client-register', {
                    success: false,
                    payload: 'USERNAME_MUST_SAME'
                });
                break;
            } else {
                countLength++;
            }
        }
        if (countLength === users.length) {
            const user = interfaceUser(socket.id, data.username, data.password);
            users.push(user);
            console.log(users);
            socket.emit('response-client-register', {
                success: true,
                payload: 'REGISTER_SUCCESS',
                value: {
                    id: socket.id,
                    username: data.username
                },
                users: users
            });
            io.sockets.emit('server-send-list-user', users);
        }
        io.sockets.emit('server-send-list-user', users);
    });
    socket.on('client-login', (data) => {
        let countLength = 0;
        if (users.length > 0) {
            for (let i = 0; i < users.length; i++) {
                if (data.username.toString() === users[i].username.toString() && data.password.toString() === users[i].password.toString()) {
                    let temp = data;
                    temp.id = socket.id;
                    delete temp.password;
                    socket.emit('response-client-login-success', temp);
                    io.sockets.emit('server-send-list-user', users);
                } else {
                    countLength++;
                }
            }
        } else {
            socket.emit('response-client-login-failed', false);
            io.sockets.emit('server-send-list-user', []);
        }
        if (countLength === users.length && users.length > 0) {
            socket.emit('response-client-login-failed', false);
        }
    });
    socket.on('getAllUser', ()=>{
        socket.emit('serverAllUser', users.map((item) => {
            return {
                id: item.id,
                username: item.username
            }
        }));
    });
});

app.get('/', (req, res) => {
    res.render('trangchu');
});

app.get('/register', (req, res) => {
    res.render('dangky');
});