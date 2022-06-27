import { Global } from '../../global';

export function deviceData(id: any, data: any) {
    let socket = Global.io.sockets;
    socket.emit(`device_${id}`, data);
}