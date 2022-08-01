import { WebSocketServer } from 'ws';

const port:any = 1337;
const wss = new WebSocketServer(({port: port}));

wss.on('connection', (ws) => {
    console.log('Connection!');

    ws.send('Connected!');
});

console.log('Listening on port ', port);