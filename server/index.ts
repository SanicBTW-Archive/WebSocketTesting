import { WebSocketServer } from 'ws';

const wsVer = "0.5";
const port:any = 6543;
const wss = new WebSocketServer(({port: port}));
var sentMessages:Object = new Object();
var messageIndex:number = 0;
var uptime = 0;

wss.on('connection', (ws) => {
    console.log('Connection!');

    ws.on('message', (data) => 
    {
        var jsonData = JSON.parse(data.toString());
        switch(jsonData.type)
        {
            case 'get messages':
                for(var i in sentMessages)
                {
                    ws.send(JSON.stringify(sentMessages[i]));
                }
                break;
            case 'new message':
                var msgData = {
                    'type': 'message',
                    'user': jsonData.user,
                    'content': jsonData.content
                };
                sentMessages['message' + messageIndex] = msgData;
                messageIndex++;
                sendToAllClients(JSON.stringify(msgData));
                break;
            case 'get version':
                var versionjson = {
                    'type': 'res version',
                    'content': wsVer
                };
                ws.send(JSON.stringify(versionjson));
                break;
            default:
                break;
        }
    });

    ws.on('close', () => {
        console.log("A connection was closed");
    });

    ws.send(JSON.stringify(connectedjson));
});

console.log('Listening on port', port);

export function sendToAllClients(data:any)
{
    wss.clients.forEach(client => client.send(data));
}

setInterval(() => {
    var timejson = {
        'type': 'uptime',
        'hours': (uptime > 3600 ? (Math.floor(uptime / 3600)) : 0),
        'min': (uptime > 60 ? (Math.floor(uptime / 60)) : 0),
        "secs": uptime
    };
    uptime++;
    sendToAllClients(JSON.stringify(timejson));
}, 1000);

var connectedjson = {
    'type': 'connected'
};