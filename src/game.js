// Games CFGs
export let CFGs = {
    Carcassone: {
        f:35,b:1,lw:"100%",lh:"100%",stretch:false,static:false,camW:1136, camH:640,
        c: ["white","red","blue","yellow","magenta","cyan"],
        actions: {mouseP:[1,false,false], mouseR:[false,false,2]},        
    },
    Chess: {
        f:13,b:0,lw:"150%",lh:"50%",stretch:true,static:true,camW:1136,camH:640,
        c: ["white","#ff9933","#3399ff"],
        actions: {mouseP:[1,false,false], mouseR:[false,false,false]}
    },
    MrJackPocket: {
        f:37,b:11,lw:"150%",lh:"100%",stretch:true,static:true,camW:1600,camH:900,
        c: ["white","#ff9933","#3399ff"],
        actions: {mouseP:[1,false,false], mouseR:[false,3,2]}
    },
    Stratego: {
        f:25,b:2,lw:"175%",lh:"100%",stretch:true,static:true,camW:1600,camH:900,
        c: ["white","#ff8800","#ff0088"],
        actions: {mouseP:[1,false,false], mouseR:[false,3,2]}
    },
}

export const serverIP = "localhost";

// Writables
import { get, writable } from 'svelte/store';
export const View = writable("Loading"); 
export const ID = writable(""); export const Name = writable(""); export const MyTurn = writable(0);

// Consts
const PI2 = Math.PI * 2;
const _angles = [0,0,Math.PI/2,Math.PI,-Math.PI/2];

// 
export let imagesF = []; export let imagesB = [];

// 
export function DrawCard(ctx, card){
    ctx.translate(card.x,card.y);
    ctx.rotate(_angles[card.rot]);

    if (card.side=="front"){
        if (card.invi) {
            ctx.globalAlpha = 0.6;
            if (card.invi==get(MyTurn)) ctx.drawImage(imagesF[card.I.front], -card.w_2, -card.h_2, card.w, card.h);
            else ctx.drawImage(imagesB[card.I.back], -card.w_2, -card.h_2, card.w, card.h);
            ctx.globalAlpha = 1;         
        } else {
            ctx.drawImage(imagesF[card.I.front], -card.w_2, -card.h_2, card.w, card.h);
        }
    } else ctx.drawImage(imagesB[card.I.back], -card.w_2, -card.h_2, card.w, card.h);

    ctx.rotate(-_angles[card.rot]);
    ctx.translate(-card.x,-card.y);
}

//
export class C_Player{
    mPos={x:0,y:0}; name="???"; cardI=false;

    constructor(Color){ this.color=Color;}

    setMPos(MPos) { this.mPos = MPos; }

    draw(ctxt,zoom,cards) {
        // Color
        ctxt.fillStyle = this.color; ctxt.strokeStyle = this.color;

        // Name
        ctxt.font = `${32/zoom}px Arial`; ctxt.textAlign = "center"; ctxt.textBaseline = "top";

        if (this.cardI)
        {
            let card = cards[this.cardI];

            // Shadow
            ctxt.shadowColor = this.color;
            ctxt.shadowOffsetX = 0; ctxt.shadowOffsetY = 0;
            ctxt.shadowBlur = card.w_2;

            // Card
            card.x = this.mPos.x; card.y = this.mPos.y; 
            DrawCard(ctxt,card);

            // Remove Shadows
            ctxt.shadowColor = "transparent";

            // Name
            ctxt.fillText(this.name, this.mPos.x, this.mPos.y+card.h_2);
        }else{
            // Cursor
            ctxt.beginPath();
            ctxt.arc(this.mPos.x, this.mPos.y, 2/zoom, 0, PI2);
            ctxt.stroke();

            ctxt.beginPath();
            ctxt.arc(this.mPos.x, this.mPos.y, 6/zoom, 0, PI2);
            ctxt.stroke();

            // Name
            ctxt.fillText(this.name, this.mPos.x, this.mPos.y+(6/zoom));
        }
        
    }
}