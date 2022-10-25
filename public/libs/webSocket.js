class C_Socket {
    cColors = ["yellow","green","red","red"]; 
    events = {};
    onMsgF = false;

    constructor(URL){
        let self = this;

        this.socket = new WebSocket(URL); 
        this.socket.onmessage = function (event) {
            let M = JSON.parse(event.data);
    
    
            if (!M.hasOwnProperty('name')) { console.error("onmessage :: M.name not found"); return; }
            if (!M.hasOwnProperty('data')) { console.error("onmessage :: M.data not found"); return; }
    
            if (self.events.hasOwnProperty(M.name)) {
                self.events[M.name](M.data);
                if (self.onMsgF) self.onMsgF();
            }
            else console.error(`onmessage :: Events[${M.name}] event not found`);
        }
    }

    getStateColor(){ return this.cColors[this.socket.readyState]; }

    addEvent(name,exe){ this.events[name] = exe; }

    sendMSG(name,data){
        if (this.socket && this.socket.readyState==1) this.socket.send( JSON.stringify( {name:name, data:data} ) );
    }
}