import WebSocket from "ws";
import { sendToAllClients } from ".";

export class Room
{
    roomID:string
    roomName:string
    roomDesc:string
    roomMessages:Object = new Object();
    messageIndex:number = 0;
    getInfo(ws:WebSocket)
    {
        if(this.roomID == "room1"){
            this.roomName = "Room 1";
            this.roomDesc = "Developer test room";
        }
        var roomInfo = {
            'type': 'room info',
            'name': this.roomName,
            'desc': this.roomDesc,
            'messages': this.roomMessages
        };
        ws.send(JSON.stringify(roomInfo));
    }

    pushMessage(daMessage:Message)
    {
        this.roomMessages[this.roomID + '-msg' + this.messageIndex] = daMessage;
        this.messageIndex++;
        var sendBack = {
            'type': 'new message',
            'message': daMessage
        }
        sendToAllClients(JSON.stringify(sendBack));
    }
}

export class Message
{
    author:string
    content:string
    creation:Date
}