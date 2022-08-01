var socket = null;
const theURL = document.getElementById('websockURL');

function onLoad()
{

}

function startConnection()
{
    socket = new WebSocket(theURL.value);
}