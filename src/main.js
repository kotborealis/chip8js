"use strict";

//Init cpu
const cpu = new Chip8();
//Init IO
const canvasManager = new CanvasManager("canvas",{fullscreen:false,width:640,height:320});
const pixelRender = new PixelRender(canvasManager,{width:64,height:32});
cpu.screen = pixelRender;
const keyboard = new Chip8_keyboard(canvasManager);
cpu.keyboard = keyboard;
const speaker = new Chip8_speaker();
cpu.speaker = speaker;

//Init bot
const bot = new Chip8_bot(cpu);

const cpu_interface = {};
cpu_interface.romName = "BRIX";
cpu_interface.romList = ["BADFOOD","15PUZZLE","BLINKY","BLITZ","BRIX","CONNECT4","GUESS","HIDDEN","INVADERS","KALEID","MAZE","MERLIN","MISSILE","PONG","PONG2","PUZZLE","SYZYGY","TANK","TETRIS","TICTAC","UFO","VBRIX","VERS","WIPEOFF"];
cpu_interface.loadRom = (cb)=>loadBinaryData("./roms/"+cpu_interface.romName,(buffer)=>{
    cpu.init(buffer);
    cb();
});
cpu_interface.startCPU = ()=>{
    cpu.reset();
    cpu_interface.loadRom(()=>cpu.start());
};
cpu_interface.resetCPU = ()=>cpu.reset();
cpu_interface.togglePauseCPU = ()=>cpu.togglePause();

const gui = new dat.GUI();
const gui_app = gui.addFolder("CPU");
gui_app.add(cpu_interface,"romName",cpu_interface.romList);
gui_app.add(cpu_interface,"startCPU");
gui_app.add(cpu_interface,"resetCPU");
gui_app.add(cpu,"paused");

gui.addFolder("Speaker").add(speaker,"enable");;

gui.addFolder("Screen").add(canvasManager,"fullscreen");

const gui_bot = gui.addFolder("Bot");
gui_bot.add(bot,"romName",Object.keys(bot.roms));
gui_bot.add(bot,"play");
gui_bot.add(bot,"stop");