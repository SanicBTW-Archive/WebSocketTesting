import { WebSocketServer } from 'ws';
import { Message, Room } from './roomHandler';

const wsVer = "0.3";
const port:any = 6543;
const wss = new WebSocketServer(({port: port}));
var uptime = 0;

wss.on('connection', (ws) => {
    var room = new Room();
    console.log('Connection!');

    ws.on('message', (data) => 
    {
        var jsonData = JSON.parse(data.toString());
        switch(jsonData.type)
        {
            case 'fetch room':
                room.roomID = jsonData.room;
                room.getInfo(ws);
                break;
            case 'send message room':
                var daMessage = new Message();
                daMessage.author = jsonData.author;
                daMessage.content = jsonData.content;
                daMessage.creation = jsonData.creationDate;
                room.pushMessage(daMessage);
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