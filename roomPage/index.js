var socket = new WebSocket('ws://sancopublic.ddns.net:6543/' + localStorage.getItem("room"));
var notif = new CustomNotification();
var wssversionText = document.getElementById('wssversionText');
var roomNameInfo = document.getElementById('roomName');
var roomDescInfo = document.getElementById('roomDesc');

const detectDeviceType = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
? 'Mobile'
: 'Desktop';

socket.addEventListener('message', (resp) => {
    var jsonData = JSON.parse(resp.data);
    switch(jsonData.type)
    {
        case 'new message':
            addMessage(jsonData.message.author, jsonData.message.content);
            break;
        case 'room info':
            roomNameInfo.innerText = jsonData.name;
            roomDescInfo.innerText = jsonData.desc;
            console.log(jsonData.messages);
            for(var i in jsonData.messages)
            {
                console.log(jsonData.messages[i]);
                addMessage(jsonData.messages[i].author, jsonData.messages[i].content)
            }
            break;
        case 'connected':
            document.getElementById('wsStatus').innerText = "Connected";
            notif.mainText = "Connected to the server";
            notif.notify();
            break;
        default:
            break;
    }
});

socket.addEventListener('close', () => {
    notif.mainText = "Lost connection to websocket";
    notif.subText = "Check your internet connection or ask the host";
    notif.notify();
    document.getElementById('wsStatus').innerText = 'Lost connection';
});

function onLoad()
{
    var outerStyle = document.createElement("style");
    if(detectDeviceType() == "Desktop")
    {
        outerStyle.innerHTML = `.outer { 
            width: 100%; height: 97.9vh; display: flex; justify-content: center; align-items: center;
        }`;
    }
    else
    {
        outerStyle.innerHTML = `.outer { 
            width: 100%; height: 90vh; display: flex; justify-content: center; align-items: center;
        }`;
    }
    document.head.appendChild(outerStyle);

    var req = {
        'type': 'get version'
    };
    socket.send(JSON.stringify(req));

    var req = {
        "type": 'fetch room',
        'room': localStorage.getItem('room')
    };
    socket.send(JSON.stringify(req));
}

function addMessage(mAuthor, mContent)
{
    var newMsgItem = document.createElement('div');

    var msgItemAuthor = document.createElement('h2');
    msgItemAuthor.style.color = 'white';
    msgItemAuthor.innerText = mAuthor;

    var msgItemContent = document.createElement('h1');
    msgItemContent.style.color = 'white';
    msgItemContent.innerText = mContent;

    newMsgItem.appendChild(msgItemAuthor);
    newMsgItem.appendChild(msgItemContent);
    document.getElementById('messages').appendChild(newMsgItem);
}

function sendMessage()
{
    var damsg = document.getElementById('wsMessage').value;
    var daData = {
        'type': 'send message room',
        'author': 'Sanco (Guest)',
        'content': damsg,
        'creationDate': new Date()
    }
    socket.send(JSON.stringify(daData));
}