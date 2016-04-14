"use strict";

function Chip8_speaker(){
    this.enable = true;
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    let oscillator = null;
    let playing = false;
    this.play = (f=440)=>{
        if(playing || !this.enable)return;
        oscillator = ctx.createOscillator();
        oscillator.frequency.value = f;
        oscillator.type = "triangle";
        oscillator.connect(gain);
        oscillator.start(0);
        playing=true;
    };
    this.stop = ()=>{
        if(!playing)return;
        oscillator.stop();
        oscillator.disconnect();
        oscillator=null;
        playing=false;
    };
}