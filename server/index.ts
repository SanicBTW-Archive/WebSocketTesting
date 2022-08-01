import { WebSocketServer } from 'ws';

const port:any = 6543;
const wss = new WebSocketServer(({port: port}));

wss.on('connection', (ws) => {
    console.log('Connection!');

    ws.on('message', (data) => {
        var jsonData = JSON.parse(data.toString());
        console.table(jsonData);

        switch(jsonData.type)
        {
            case 'message':
                console.log("trying to send data back");
                var daData = {
                    'user': jsonData.user,
                    'content': jsonData.content
                };
                console.table(daData);
                wss.clients.forEach(client => client.send(JSON.stringify(daData, null, 2)));
                break;
            default:
                //do nothing
                break;
        }
    });

    ws.send('Connected!');
});

console.log('Listening on port ', port);