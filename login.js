
var socket = io.connect('http://' + document.domain + ':' + location.port); 

        socket.on('connect', () => {
        //Add new channel
            var button = document.querySelector('#channelsubmit');
            console.log(button);
            button.onclick = () => {
                const newchannel = document.querySelector('#channeltext').value;
                console.log(newchannel);
                document.querySelector('#channeltext').value = '';
                socket.emit('createchannel', {"newchannel": newchannel});
            };
        });

        //Display available channels when page loads
        socket.on('displayavailchannels', (data) => {
            const channels = data['channels'];
            console.log(channels);
            channels.forEach((channel) => {
                display_channel(channel);
            })
            });

        //Display new channel when created
        socket.on('displaynewchannel', (data) => {
            const newchannel = data['displaynewchannel'];
            console.log(newchannel);
            display_channel(newchannel);
        });

        //Function for displaying channel template
        function display_channel(channel) {
            const template = Handlebars.compile(document.querySelector('#displaychannel').innerHTML);
            const content = template({'channel': channel});
            document.querySelector('.list-group').innerHTML += content; 
        }

        //Function for selecting a channel when clicked
        function select_channel(content) {
            const currentchannel = content.querySelector('h6').innerHTML;
            localStorage.setItem('currentchannel', currentchannel);
            socket.emit('joinchannel', {'currentchannel':currentchannel});
        }

        //Display messages after joining channel 
        socket.on('displaymessages', (data) => {
            const messages = data['messages'];
            console.log(messages);
            document.querySelector('.chat-box').innerHTML = null;
            messages.forEach((message) => {
                display_message(message);
            })
        });

        //Function for displaying new messages in the current channel
        socket.on('displaynewmessage', (data) => {
            const message = data['message'];
            console.log(message);
            display_message(message);
        })

        //Function for sending new messages to server
        document.querySelector('#message-form').addEventListener('submit', (e) => {
            const message = document.querySelector('#message-form-text').value;
            document.querySelector('#message-form-text').value = '';
            console.log(message);
            e.preventDefault();
            socket.emit('newmessage', {'currentchannel': localStorage.getItem('currentchannel'), 'userid':localStorage.getItem('userid'), 'message':message});
        })
        
        //Function for displaying messages template
        function display_message(message) {
            if (message['userid'] === localStorage.getItem('userid')) {
                const template = Handlebars.compile(document.querySelector('#displaymessage-sender').innerHTML);
                const content = template({'message': message['userid'], 'time': message['time'], 'date':message['date']});
                document.querySelector('.chat-box').innerHTML += content;
            }
            else {
                const template = Handlebars.compile(document.querySelector('#displaymessage-receiver').innerHTML);
                const content = template({'message': message['userid'], 'time': message['time'], 'date':message['date']});
                document.querySelector('.chat-box').innerHTML += content;
            }
        
        }



