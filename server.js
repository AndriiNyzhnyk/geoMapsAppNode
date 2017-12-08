let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
app.set('port', process.env.PORT || 3000);

let connectedUsers = {};

app.get("/", (req, res) => {
    res.sendFile('index.html');
});

io.on('connection', (socket) => {
    console.log('connect');

    socket.on('addUser', (dataUser) => {
        connectedUsers[dataUser.id] = dataUser;
         // socket.emit('allUsers', connectedUsers);
        io.sockets.emit('newUser', dataUser);
    });

    socket.on('getUsers', () => {
        socket.emit('allUsers', connectedUsers);
    });

    socket.on('disconnect', () => {
        io.sockets.emit('deleteUser', connectedUsers[socket.id] );
        delete connectedUsers[socket.id];
    });

});


server.listen(app.get('port'), () => {
    console.log( 'Express запущенний на http://localhost:' +
        app.get('port') + '; нажміть Ctrl+C для завершення.' );
});