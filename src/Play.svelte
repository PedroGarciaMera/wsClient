<script>
    import { onMount } from "svelte";
    // import { Canvas, Layer, t } from "svelte-canvas";
    import { ID, Name, DrawCard, C_Player, serverIP } from './game.js';

    export let gameCFG;

    // GET CANVAS
    let canvas; let ctx; onMount(() => {ctx = canvas.getContext('2d');})
    
    // Camera
    let camera = new C_Camera(gameCFG.camW,gameCFG.camH,24,gameCFG.stretch,gameCFG.static);

    // VARS
    let sfxTurn = new Audio('/sfx/newTurn.mp3');

    let w_w = window.innerWidth; let w_h = window.innerHeight;

    let lastTimeSendMouse = performance.now();

    let pjs = {}; let cards = []; let turn = 0;

    // SOCKET
    let WS = new C_Socket(`ws://${serverIP}:22122/game`);
    // let WS = new C_Socket("ws://localhost:22122/game");

    WS.onMsgF = () => drawCTX();

    WS.addEvent("gameStatus",(data) => {
        data.pjs.forEach(pj => { if(!pjs[pj.id]) pjs[pj.id] = new C_Player(gameCFG.c[pj.turn]); });  
        cards = [{}, ...data.cards]; turn = data.turn;

        WS.sendMSG("setName",$Name);
    });

    WS.addEvent("setMyID",(clientID) => $ID = clientID );

    WS.addEvent("setNames",(data) => { console.log("$ID",$ID)
        data.forEach(pj => { pjs[pj.id].name = pj.name; });
    });

    WS.addEvent("playerDC",(data) => { delete pjs[data.id]; turn=data.turn; });

    WS.addEvent("updateMousePos",(data) => pjs[data.id].setMPos({x:data.x, y:data.y}) );

    WS.addEvent("card2Mouse",(data) => { cards[data.index].onBoard = false; pjs[data.id].cardI = data.index; });
    WS.addEvent("card2Board",(data) => {
        pjs[data.id].cardI = false;

        let card = cards[data.index];
        card.onBoard = true; card.x = data.x; card.y = data.y; card.side = data.side;
    });

    WS.addEvent("rotCard",(data) => { cards[data.index].rot = data.rot; });

    WS.addEvent("sideBoardCard",(data) => { cards[data.index].side = data.side; cards[data.index].invi = data.invi; });

    WS.addEvent("setTurn",(data) => { turn = data; sfxTurn.play() });


    // Buttons Events & Actions
    function keyup(e){ 
        if(e.key=='c') camera.resetPos();
        if(e.key=='t') WS.sendMSG("nextTurn");
     }

    function mousePress(e){ 
        if (e.button==1) { e.preventDefault(); return false; }  // Disable middle button scroll
        if (gameCFG.actions.mouseP[e.button]) WS.sendMSG("action",gameCFG.actions.mouseP[e.button]); 
    }
    function mouseRelease(e){ if (gameCFG.actions.mouseR[e.button]) WS.sendMSG("action",gameCFG.actions.mouseR[e.button]); }

    function mouseMove(e){ camera.checkMove(e.clientX,e.clientY);  sendMousePos(e.clientX,e.clientY); }
    function mouseWheel(e){ camera.changeZoom(e.deltaY>0 ? -0.1 : 0.1); sendMousePos(e.clientX,e.clientY); } 
    function sendMousePos(x,y){
        if (performance.now() - lastTimeSendMouse < 32) return;
        lastTimeSendMouse = performance.now();

        WS.sendMSG("mousePos",camera.mousePos(x,y))
    }

    // Resize window
    function handleResize(){ 
        w_w = window.innerWidth; w_h = window.innerHeight; if (camera.stretch) camera.windowResize(w_w,w_h); 
    }
    if (camera.stretch) camera.windowResize(w_w,w_h); 

    // DRAW
    function drawCTX(){
        ctx.clearRect(0, 0, w_w, w_h);

        ctx.save(); camera.updatePos();
        
        //// WORLD
        camera.attach(ctx);
        // Cards
        cards.forEach(card => { if(card.onBoard) DrawCard(ctx, card); });

        // // Pjs
        for (const [id, pj] of Object.entries(pjs)) pj.draw(ctx,camera.zoom, cards);
        
        //// HUD
        camera.detach(ctx);
        // Conection Status
        ctx.lineWidth = 4; ctx.strokeStyle = WS.getStateColor(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w_w, 0); ctx.stroke();
        // Turn
        ctx.fillStyle=gameCFG.c[turn]; ctx.beginPath(); ctx.arc(0, 0, 32, 0, Math.PI*2); ctx.fill();


        // Zoom
        // ctx.font = "20px Arial";
        // ctx.textAlign = "left";
        // ctx.textBaseline = "center";	
        // ctx.fillText(`Z: ${camera.zoom}`, 0, 0);

        //
        ctx.restore();        
    }
</script>

<svelte:window 
    on:keyup={keyup}
	on:mousedown={mousePress} on:mouseup={mouseRelease} on:mousemove={mouseMove} on:wheel={mouseWheel}
    on:resize|passive={handleResize}
/>
<svelte:body on:contextmenu|preventDefault={() => {}}/>

<canvas bind:this={canvas} style="background-color:black;" width={w_w} height={w_h}></canvas>