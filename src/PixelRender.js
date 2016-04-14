'use strict';

function PixelRender(canvasManager,options={}){
    options.width = options.width||64;
    options.height = options.height||32;

    const ctx = canvasManager.ctx;
    let zoomFactor;
    canvasManager.onresize = ()=>{
        zoomFactor={x:canvasManager.e_canvas.width/options.width,y:canvasManager.e_canvas.height/options.height};
    };
    canvasManager.onresize();

    this.pixels=new Uint8Array(options.width*options.height);

    const redraw = ()=>{
        startRender();
        renderPixels();
        endRender();
    };
    this.render = redraw;

    const startRender = ()=>{
        canvasManager.clear("#000000");
        ctx.save();
        ctx.scale(zoomFactor.x,zoomFactor.y);
    };

    const endRender = ()=>ctx.restore();

    const renderPixels = ()=>{
        ctx.fillStyle="#fff";
        let i;
        for(let y=0;y<options.height;y++)
            for(let x=0;x<options.width;x++){
                i = y*options.width+x;
                if(i>=this.pixels.length)return;
                if(!this.pixels[i])continue;
                ctx.fillRect(x, y, 1, 1);
            }
    };

    this.setPixel = (x,y)=>{
        while(x>options.width-1)
            x-=options.width;
        while(x<0)
            x+=options.width;
        while(y>options.height-1)
            y-=options.height;
        while(y<0)
            y+=options.height;
        const index = x+y*options.width;
        this.pixels[index]=this.pixels[index]^1;
        return !this.pixels[index];
    };

    this.clear = ()=>{
        for(let i=0;i<this.pixels.length;i++)
            this.pixels[i]=0;
        canvasManager.clear();
    }
}
