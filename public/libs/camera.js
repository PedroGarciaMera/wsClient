class C_Camera{
    constructor(W,H,Border,Stretch,Static){ 
        this.w = W; this.h = H; this.border=Border; this.stretch=Stretch; this.static=Static;
        this.x=0; this.y=0; this.mx=false; this.my=false; this.spd=4; this.zoom=1; this.sx=1; this.sy=1;        
    }
    
    resetPos() { this.x=0; this.y=0; }
    changeZoom(v) { 
        if (this.stretch) return;

        this.zoom+=v; if (this.zoom<0.2) this.zoom = 0.2;
        this.sx = this.zoom; this.sy = this.zoom;

        // Strech to w_w w_h
        // if (this.stretch){ this.sx = (window.innerWidth/this.w)*this.zoom; this.sy = (window.innerHeight/this.h)*this.zoom; }
    }
    checkMove(mX,mY) { 
        if (this.static) return;

        let acc = this.spd/this.zoom;
        this.mx=false; if (mX<this.border) this.mx=-acc; if (mX>window.innerWidth-this.border) this.mx=acc;
        this.my=false; if (mY<this.border) this.my=-acc; if (mY>window.innerHeight-this.border) this.my=acc;   
    }
    windowResize(w,h){ this.sx = (w/this.w)*this.zoom; this.sy = (h/this.h)*this.zoom; }
    mousePos(mX,mY){ return {x:(mX/this.sx)+this.x,y:(mY/this.sy)+this.y}; }
    updatePos() { 
        if (this.static) return false;
        
        if (this.mx) this.x+=this.mx; if (this.my) this.y+=this.my; 
    }
    attach(ctx) { this.T = ctx.getTransform(); ctx.scale(this.sx, this.sy); ctx.translate(-this.x, -this.y); }
    detach(ctx) { ctx.setTransform(this.T.a, 0, 0, this.T.d, 0, 0); }
}