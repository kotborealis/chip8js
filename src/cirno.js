"use strict";

function Cirno_BRIX(cpu){
    this.press_left = ()=>{
        cpu.keyboard.key[4]=1;
        cpu.keyboard.key[6]=0;
    };
    this.press_right = ()=>{
        cpu.keyboard.key[6]=1;
        cpu.keyboard.key[4]=0;
    };
    this.release = ()=>{
        cpu.keyboard.key[6]=0;
        cpu.keyboard.key[4]=0;
    };
    this.cycle=()=>{
        const d = cpu.v[6]-cpu.v[12]-3;
        if(d>1) {
            if(cpu.v[12]+6<64)
                this.press_right();
        }
        else if(d<-1)
            if(cpu.v[12]>0)
                this.press_left();
        else
            this.release();
        setTimeout(this.cycle,0);
    };
    //v[6] - ball
    //v[12] - platform
}