var socket = new WebSocket('ws://sancopublic.ddns.net:6543/');

socket.addEventListener('message', (resp) => {
    console.log("got data");

    if(resp.data == "Connected!")
    {
        document.getElementById('wsStatus').innerText = "Connected";
    }

    if(resp.data != ("Connected!"))
    {
        var jsonData = JSON.parse(resp.data);
        console.table(jsonData);

        addMessage(jsonData.user, jsonData.content);
    }
});

function onLoad()
{
    var the = localStorage.getItem('wsName');
    var daData = {
        'type': 'userName',
        'content': ((the != null || undefined) ? the : "guest")
    };
    localStorage.setItem('wsName', daData.content);
    socket.send(JSON.stringify(daData, null, 2));

    document.getElementById('wsName').value = the;

    var req = {
        'type': 'get messages request',
    };

    socket.send(JSON.stringify(req, null, 2));
}

function applyName()
{
    localStorage.setItem('wsName', document.getElementById('wsName').value);
    window.location.reload(true);
}

function sendMessage()
{
    var damsg = document.getElementById('wsMessage').value;
    var daData = {
        'type': 'message',
        'user': localStorage.getItem('wsName'),
        'content': damsg
    };
    socket.send(JSON.stringify(daData, null, 2));
}

function addMessage(messageAuthor, messageContent)
{
    var newMsgItem = document.createElement('div');

    var msgItemAuthor = document.createElement('h2');
    msgItemAuthor.style.color = 'white';
    msgItemAuthor.innerText = messageAuthor;

    var msgItemContent = document.createElement('h1');
    msgItemContent.style.color = 'white';
    msgItemContent.innerText = messageContent;

    newMsgItem.appendChild(msgItemAuthor);
    newMsgItem.appendChild(msgItemContent);
    document.getElementById('messages').appendChild(newMsgItem);
}