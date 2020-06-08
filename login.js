socket.on('displaynewchannel', (data) => {
    const newchannel = data['displaynewchannel'];
    console.log(newchannel);
    const template = Handlebars.compile(document.querySelector('#displaychannel').innerHTML);
    const content = template({'newchannel': newchannel});
    document.querySelector('.messages-box').innerHTML += content;
});

