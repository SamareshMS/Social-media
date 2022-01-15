module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer); 

    // Whenever a connection request is received it automatically will send back an acknowledgment to the front end by emitting a connect event
    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });

        // Whenever firing an event it is .emit() whenever receiving a fired event then it is .on()

        // User has sent the request to join the room
        socket.on('join_room',function(data){
            console.log('joining request received ', data); 

            // The below code will make the user join the chatroom
            socket.join(data.chatroom);

            // Emits all the users who are there in the chatroom
            io.in(data.chatroom).emit('user_joined ', data);
        })

        socket.on('send_message', function(data){
            io.in(data.chatroom).emit('receive_message', data);
        });

    });

}