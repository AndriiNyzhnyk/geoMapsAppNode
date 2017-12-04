let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
app.set('port', process.env.PORT || 3000);

app.get("/", (req, res) => {
    res.sendFile('index.html');
});

server.listen(app.get('port'), () => {
    console.log( 'Express запущенний на http://localhost:' +
        app.get('port') + '; нажміть Ctrl+C для завершення.' );
});