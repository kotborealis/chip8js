'use strict';

function CanvasManager(canvas,options={}){
    options.fullscreen=options.fullscreen||false;
    options.width=options.width||800;
    options.height=options.height||600;
    options.enableDrag=options.enableDrag||false;
    /**
     * Canvas
     */
    if(typeof canvas === 'string') {
        this.e_canvas = document.getElementById(canvas);
        if(this.e_canvas===null){
            this.e_canvas = document.createElement('canvas');
            this.e_canvas.id = canvas;
            document.body.appendChild(this.e_canvas);
        }
    }
    else
        this.e_canvas=canvas;

    this.e_canvas.width=options.width;
    this.e_canvas.height=options.height;
    this.ctx = this.e_canvas.getContext("2d");
    this.canvas={};

    window.onresize = ()=> {
        if(options.fullscreen) {
            this.e_canvas.width = window.innerWidth;
            this.e_canvas.height = window.innerHeight;
        }
        else{
            this.e_canvas.width=options.width;
            this.e_canvas.height=options.height;
        }
        this.clear();
        this.onresize();
    };
    this.onresize = ()=>{};
    setTimeout(()=>window.onresize(),0);

    /**
     * Mouse Events
     */
    this.onmousemove=(e)=>{};
    this.onclick=(e)=>{};
    this.ondblclick=(e)=>{};
    this.ondrag=(e)=>{};
    this.onmousedown=(e)=>{};
    this.onmouseup=(e)=>{};
    this.onmousewheel=(e)=>{};
    this.onmouseover=(e)=>{};
    this.onmouseout=(e)=>{};

    /**
     * Mouse State
     */
    this.mouse={};
    this.mouse.x=0;
    this.mouse.y=0;
    this.mouse.over=false;
    this.mouse.down=false;
    this.mouse.button=null;

    /**
     * Mouse Handlers
     */
    this.e_canvas.addEventListener('mousedown',e=>{
        this.mouse.down=true;
        this.mouse.button=e.button;
        const {x,y}=canvasCoords(e.clientX,e.clientY);
        this.onmousedown({button:e.button,x,y});
    });
    this.e_canvas.addEventListener('mouseup',e=>{
        this.mouse.down=false;
        const {x,y}=canvasCoords(e.clientX,e.clientY);
        this.onmouseup({button:e.button,x,y});
    });
    this.e_canvas.addEventListener('mouseover',e=>{
        this.mouse.over=true;
        this.onmouseover();
    });
    this.e_canvas.addEventListener('mouseout',e=>{
        this.mouse.over=false;
        this.onmouseout();
    });
    this.e_canvas.addEventListener('mousemove',e=>{
        if(!this.mouse.over)return;
        const {x,y}=canvasCoords(e.clientX,e.clientY);
        const dx = (x - this.mouse.x);
        const dy = (y - this.mouse.y);
        if(this.mouse.down && options.enableDrag)
            this.ondrag({button:this.mouse.button,dx,dy,x,y});
        else
            this.onmousemove({x,y});
        this.mouse.x=x;
        this.mouse.y=y;
    });
    this.e_canvas.addEventListener('click',e=>{
        this.onclick({button:e.button,x:this.mouse.x,y:this.mouse.y})
    });
    this.e_canvas.addEventListener('dblclick',e=>{
        this.ondblclick({button:e.button,x:this.mouse.x,y:this.mouse.y})
    });
    this.e_canvas.addEventListener('mousewheel',e=>{
        this.onmousewheel(e)
    });


    /**
     * Keyboard Events
     */
    this.onkeydown = ()=>{};
    this.onkeyup = ()=>{};

    /**
     * Keyboard State
     */
    this.keyboard={};
    this.keyboard.altKey=false;
    this.keyboard.ctrlKey=false;
    this.keyboard.shiftKey=false;

    /**
     * Keyboard Handlers
     */
    window.addEventListener('keydown',e=>{
        this.keyboard.altKey = e.altKey;
        this.keyboard.shiftKey = e.shiftKey;
        this.keyboard.ctrlKey = e.ctrlKey;
        this.onkeydown({altKey:e.altKey,shiftKey:e.shiftKey,ctrlKey:e.ctrlKey,keyCode:e.keyCode});
    });
    window.addEventListener('keyup',e=>{
        this.keyboard.altKey = e.altKey;
        this.keyboard.shiftKey = e.shiftKey;
        this.keyboard.ctrlKey = e.ctrlKey;
        this.onkeyup({altKey:e.altKey,shiftKey:e.shiftKey,ctrlKey:e.ctrlKey,keyCode:e.keyCode});
    });

    /**
     * Methods
     */
    this.clear = (color="#000000")=>{
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0,0,this.e_canvas.width,this.e_canvas.height);
    };
    const canvasCoords = (_x,_y)=>{
        const x = _x-this.e_canvas.getBoundingClientRect().left;
        const y = _y-this.e_canvas.getBoundingClientRect().top;
        return {x,y};
    };
    
    Object.defineProperty(this,"fullscreen",{
        get: ()=>options.fullscreen,
        set: (v)=>{options.fullscreen=v;window.onresize();}
    });
}