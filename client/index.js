var socket = new WebSocket('ws://sancopublic.ddns.net:6543/');
var notif = new CustomNotification();
var uptimeText = document.getElementById('uptimeText');
var wssversionText = document.getElementById('wssversionText');

const detectDeviceType = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
? 'Mobile'
: 'Desktop';

socket.addEventListener('message', (resp) => {
    var jsonData = JSON.parse(resp.data);
    switch(jsonData.type)
    {
        case 'res version':
            wssversionText.innerText = jsonData.content;
            break;
        case 'uptime':
            uptimeText.innerText = doTimeCheck(jsonData.hours, jsonData.min, jsonData.secs);
            break;
        case 'connected':
            document.getElementById('wsStatus').innerText = "Connected";
            notif.mainText = "Connected to the server";
            notif.notify();
            break;
        default:
            console.log("RECEIVED NOT SUPPORTED DATA!");
            break;
    }
});

socket.addEventListener('close', () => {
    notif.mainText = "Couldn't connect to websocket / Lost connection to websocket";
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
    }
    socket.send(JSON.stringify(req));
}

function doTimeCheck(h, m, s)
{
    var hourString = "00";
    var minString = "00";
    var secString = "00";
    var fixedSecs = Math.floor(s % 60);
    if(h < 10)
    {
        hourString = "0" + h;
    }
    else
    {
        hourString = h;
    }
    if(m < 10)
    {
        minString = "0" + m;
    }
    else
    {
        minString = m;
    }
    if(fixedSecs < 10)
    {
        secString = "0" + fixedSecs;
    }
    else
    {
        secString = fixedSecs;
    }
    return `${hourString}:${minString}:${secString}`;
}