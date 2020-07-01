# Flack

> Attempt at making at Web Chat Application using Flask and Socketio to support real-time messaging.

![Flack](/static/project2.jpg)

## Features

- Creating a display name
- Creating a new channel with a unique channel name
- Display all channels available and select a channel to join
- Send messages to all other users in the same chat room using Flask Rooms
- Remembers the channel user was on previously and takes the user back to the channel upon closing the browser and returning to the site.
- Allows users to delete(hide) a message

## Setup

- Download requirements
- Configure environment variables

```shell 
$ pip3 install -r requirements.txt
$ EXPORT FLASK_APP=application.py
$ python3 -m flask run
```
