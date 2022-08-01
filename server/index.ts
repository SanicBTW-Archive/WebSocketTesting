import { WebSocketServer } from 'ws';
import { dataTypes } from './src/dataTypes';

const port:any = 6543;
const wss = new WebSocketServer(({port: port}));
var uptime = 0;
var dataShit = new dataTypes();

wss.on('connection', (ws) => {
    console.log('Connection!');

    ws.on('message', (data) => 
    {
        
    });

    ws.send(dataShit.connected());
});

console.log('Listening on port', port);

function sendToAllClients(data:any)
{
    wss.clients.forEach(client => client.send(data));
}

setInterval(() => {
    dataShit.secs = uptime;
    uptime++;
    sendToAllClients(dataShit.time());
}, 1000);
