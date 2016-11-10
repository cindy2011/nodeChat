var express = require('express'), //引入express模块  
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = [];
app.use('/', express.static(__dirname + '/www')); //指定静态HTML文件的位置  
server.listen(8055);
console.log('server started');
//socket部分  
io.on('connection', function(socket) {
    //接收并处理客户端发送的foo事件  
    socket.on('login', function(nickname) {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname,users.length,'login');
        }
    });
    socket.on('disconnect',function(){
    	users.splice(socket.userIndex,1);
    	socket.broadcast.emit('system',socket.nickname,users.length,'logout');
    });
    socket.on('postMsg',function(msg,color){
    	socket.broadcast.emit('newMsg',socket.nickname,msg,color);
    });
    socket.on('img',function(imgData){
    	socket.broadcast.emit('newImg',socket.nickname,imgData);
    })
});
