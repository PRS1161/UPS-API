import { Global } from '../../global';
const socket = Global.io.sockets;

socket.on('connection', (socket) => {
    console.log("A user connected");
});