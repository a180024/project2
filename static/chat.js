/* Handling of public channels 
--------------------------------------------------------------------------------------------------------------------------------------- */
var count = 0;
var socket = io.connect('http://' + document.domain + ':' + location.port); 

//Add new channel
socket.on('connect', () => {
    var button = document.querySelector('#channelsubmit');
    button.onclick = () => {
        const newchannel = document.querySelector('#channeltext').value;
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
    const date = new Date();
    const date_format = date.getMonth() + ' ' + date.toLocaleString('default', { month: 'long' });
    const template = Handlebars.compile(document.querySelector('#displaychannel').innerHTML);
    const content = template({'channel': channel, 'date': date_format});
    document.querySelector('.list-group').innerHTML += content; 
}

//Function for selecting a channel when clicked
function select_channel(content) {
    const newchannel = content.querySelector('h6').innerHTML;
    if (localStorage.getItem('currentchannel')) {
        socket.emit('leavechannel', {'currentchannel': localStorage.getItem('currentchannel')});
    }
    localStorage.setItem('currentchannel', newchannel);
    socket.emit('joinchannel', {'newchannel':newchannel});
}

//Display messages after joining channel 
socket.on('displaymessages', (data) => {
    const messages = data['messages'];
    console.log(messages);
    document.querySelector('.chat-box').innerHTML = null;
    messages.forEach((message) => {
        count++;
        console.log(count);
        display_message(message, count);
    })
});

//Function for displaying new messages in the current channel
socket.on('displaynewmessage', (data) => {
    const message = data['message'];
    const messageid = data['messageid'];
    console.log(message);
    count++;
    console.log(count);
    display_message(message, count);
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
function display_message(message, count) {
    if (message['userid'] === localStorage.getItem('userid')) {
        const template = Handlebars.compile(document.querySelector('#displaymessage-sender').innerHTML);
        const content = template({'message': message['message'], 'userid': message['userid'], 'date':message['date'], 'id':count, 'id2':count});
        document.querySelector('.chat-box').innerHTML += content;
    }
    else {
        const template = Handlebars.compile(document.querySelector('#displaymessage-receiver').innerHTML);
        const content = template({'message': message['message'], 'userid': message['userid'], 'date':message['date'], 'id':count, 'id2':count});
        document.querySelector('.chat-box').innerHTML += content; 
    }
}

//Hiding a message
function hide_message(content) {
    const id = content.getAttribute('id');
    const messageid = 'm' + id;
    const message = document.querySelector(`#${messageid}`);
    message.style.display = "none";
}