"use strict";
const _keyMap = {
    49:0,//1
    50:1,//2
    51:2,//3
    52:3,//4
    81:4,//q
    87:5,//w
    69:6,//e
    82:7,//r
    65:8,//a
    83:9,//s
    68:10,//d
    70:11,//f
    90:12,//z
    88:13,//x
    67:14,//c
    86:15//v
};
function Chip8_keyboard(canvasManager,keyMap=_keyMap){
    this.key = new Uint8Array(16);
    let callbackOnNext=false;
    let callback=()=>{};
    canvasManager.onkeydown = e=>{
        this.key[keyMap[e.keyCode]]=1;
        if(callbackOnNext) {
            callback(keyMap[e.keyCode]);
            callbackOnNext=false;
        }
    };
    canvasManager.onkeyup = e=>{
        this.key[keyMap[e.keyCode]]=0;
    };

    this.onNext = (_callback)=>{
        callbackOnNext=true;
        callback=_callback;
    };
    this.clear = ()=>this.key = new Uint8Array(16);
}