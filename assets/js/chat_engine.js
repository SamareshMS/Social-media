// This class is going to send a request for the connection

class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        // as soon as the class is initialized the connection request is sent
        // io.connect() fires an event called connection which is used in the server (in chat_socket file)
        this.socket = io.connect('http://localhost:5000');
        // console.log('****************',userEmail)
        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self = this;
        // console.log('running')

        // the server sends the acknowledgment as an event named connect that the connection is established
        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');
        });

        // User sending the req to join the room
        self.socket.emit('join_room', {
            user_email: self.userEmail,
            chatroom: 'sodia'
        });

        self.socket.on('user_joined', function(data){
            console.log('a user joined!', data);
        })

        $(`#send-message`).click(function(){
            let msg = $('#chat-message-input').val();
            if(msg!='')
            {
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'sodia'
                });
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);

            let newMessage = $('<li>');
            
            let messageType = 'other-message';

            if(data.user_email == self.userEmail){
                messageType = 'self-message';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.append($('<sub>', {
                'html': data.user_email
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        })
    }
}