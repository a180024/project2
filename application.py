import os

from flask import Flask, render_template, redirect, url_for, flash, request
from flask_socketio import SocketIO, emit, join_room, leave_room

#Set up Flask & Socketio
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY") or 'secret'
socketio = SocketIO(app)

#Store 100 messages in each channel
channels = {}

@app.route('/', methods = ['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    userid = request.form.get('userid')
    if userid:
        return redirect(url_for('chat'))
    else:
        return redirect(url_for('login'))

@app.route('/chat')
def chat():
    return render_template('chat.html')

#Display all available channels when page loads
@socketio.on('connect')
def connect():
    display_channels = list(channels.keys())
    socketio.emit('displayavailchannels', {"channels":display_channels}, broadcast=True)

#Display new channel when created
@socketio.on('createchannel')
def createchannel(data):
    newchannel = data['newchannel']
    channels[newchannel] = []
    print(channels)
    socketio.emit('displaynewchannel', {"displaynewchannel":newchannel}, broadcast=True)

#Join channel(room) and emit messages
@socketio.on('joinchannel')
def joinchannel(data):
    channel = data['currentchannel'].strip()
    print(channel)
    join_room(channel)
    try:
        messages = channels[channel]
        print(messages)
    except KeyError as e:
        print(e)
    socketio.emit('displaymessages', {"messages":messages}, room=channel)






