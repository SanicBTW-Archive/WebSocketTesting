import { WebSocketServer } from 'ws';

const port:any = 6543;
const wss = new WebSocketServer(({port: port}));
var messagesSentArray = new Object();
var messageIndex = 0;

wss.on('connection', (ws) => {
    console.log('Connection!');

    ws.on('message', (data) => {
        var jsonData = JSON.parse(data.toString());
        console.table(jsonData);

        switch(jsonData.type)
        {
            case 'get messages request':
                console.log('requested to send all messages');
                
                for(var i in messagesSentArray)
                {
                    ws.send(JSON.stringify(messagesSentArray[i]));
                }
                break;
            case 'message':
                var daData = {
                    'user': jsonData.user,
                    'content': jsonData.content
                };
                console.log("trying to save data and sending it back");
                messagesSentArray['msg' + messageIndex] = daData;
                messageIndex ++;
                console.table(daData);
                sendToAllClients(JSON.stringify(daData, null, 2));
                break;
            default:
                //do nothing
                break;
        }
    });

    ws.send('Connected!');
});

console.log('Listening on port', port);

function sendToAllClients(data:any)
{
    wss.clients.forEach(client => client.send(data));
}