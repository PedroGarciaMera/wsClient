const url = "ws://92.59.246.19:22122/game";
// const url = "ws://172.20.5.228:22122/game";

let Events = {}; let Socket;
export function addEvent(name,exe){ Events[name] = exe; }

export function init(){
    Socket = new WebSocket(url);

    Socket.onmessage = function (event) {
        let M = JSON.parse(event.data);


        if (!M.hasOwnProperty('name')) { console.error("onmessage :: M.name not found"); return; }
        if (!M.hasOwnProperty('data')) { console.error("onmessage :: M.data not found"); return; }

        if (Events.hasOwnProperty(M.name)) Events[M.name](M.data);
        else console.error(`onmessage :: Events[${M.name}] event not found`);
    }
}

export function sendMSG(name,data){
    if (Socket && Socket.readyState==1) Socket.send( JSON.stringify( {name:name, data:data} ) );
}

export function getStateColor(){
    const colors = ["yellow","green","red","red"];
    return colors[Socket.readyState];
}