let express = require('express');
let helmet = require('helmet');
let cors = require('cors');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);

app.use(helmet());
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.set('port', process.env.PORT || 3000);

let connectedUsers = {};

app.get("/", (req, res) => {
    res.sendFile('index.html');
});

io.on('connection', (socket) => {
    socket.on('addUser', (dataUser) => {
        const newUser = JSON.parse(dataUser);
        connectedUsers[newUser.id] = newUser;
        io.sockets.emit('newUser', dataUser);
    });

    socket.on('getUsers', () => {
        socket.emit('allUsers', JSON.stringify(connectedUsers));
    });

    socket.on('disconnect', () => {
        io.sockets.emit('deleteUser', socket.id );
        delete connectedUsers[socket.id];
    });

});

server.listen(app.get('port'), () => {
    console.log( 'Express запущенний на http://localhost:' +
        app.get('port') + '; нажміть Ctrl+C для завершення.' );
});