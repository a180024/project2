import os
import datetime
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
    socketio.emit('displayavailchannels', {"channels":display_channels})

#Display new channel when created
@socketio.on('createchannel')
def createchannel(data):
    global channels
    newchannel = data['newchannel']
    channels[newchannel] = []
    print(channels)
    socketio.emit('displaynewchannel', {"displaynewchannel":newchannel}, broadcast=True)

#Join channel(room) and emit messages
@socketio.on('joinchannel')
def joinchannel(data):
    global channels
    channel = data['newchannel'].strip()
    print(channel)
    join_room(channel)
    try:
        messages = channels[channel]
        print(messages)
    except KeyError as e:
        print(e)
    socketio.emit('displaymessages', {"messages":messages}, room=channel)

#Leave current channel before joining new channel
@socketio.on('leavechannel')
def leavechannel(data):
    channel = data['currentchannel'].strip()
    print(channel)
    leave_room(channel)
    return

#Display new messages in current channel
@socketio.on('newmessage')
def newmessage(data):
    global channels
    date_time = datetime.datetime.now()
    date = date_time.strftime('%d') + ' ' + date_time.strftime('%b') + ' ' + date_time.strftime("%H") + ':' + date_time.strftime("%M") 
    message = {'userid': data['userid'], 'message': data['message'],  'date': date}
    print(message)
    channel = data['currentchannel'].strip()
    if len(channels[channel]) >= 100:
        channels[channel].pop()
    channels[channel].append(message)
    print(channels[channel])
    socketio.emit('displaynewmessage', {'message': message}, room=channel)








