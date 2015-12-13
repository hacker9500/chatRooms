var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

var bodyParser = require('body-parser');

app.use(bodyParser());

app.set('view engine','ejs');
app.set('views', __dirname + "/views");

var http = require('http').Server(app);

var io = require('socket.io')(http);

var userInfo = {};

app.post("/chat",function (req,resp){
    console.log("form submitted");
    console.log(req.body.name + " " + req.body.room);
    resp.render('chat',{name : req.body.name, room : req.body.room});
});

app.get("/chat",function (req,resp){
    console.log("form submitted");
    resp.render('chat');
});

io.on('connection', function (socket){
    console.log("new user connected");

    socket.on("message", function(message){
        console.log(message.text +" "+userInfo[socket.id].room);
        socket.broadcast.to(userInfo[socket.id].room).emit("message", message);
    });

    socket.on("joinRoom", function (req){
        userInfo[socket.id] = req;
        console.log(userInfo);
        socket.join(req.room);
    });
});

// app.get("/chat",function (req,resp){
//     console.log("fget chat");
//     //resp.send("coming");
//     resp.render('chat');
// });

http.listen(3000);