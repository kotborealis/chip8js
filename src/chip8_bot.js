"use strict";

function Chip8_bot(cpu){
    let bot_cycle_timeout;
    this.romName="BRIX";
    this.roms = {};
    /**
     * BRIX Game bot
     * cpu.v[6] - Ball x position
     * cpu.v[7] - Ball y position
     * cpu.v[12] - Platform x position
     */
    this.roms.BRIX = function(){
        const ball = {};
        ball.x=0;
        ball.y=0;
        ball._x=0;
        ball._y=0;
        const platform = {};
        platform.x = 0;
        platform.center = 3;

        const press_left = ()=> {
            cpu.keyboard.key[4] = 1;
            cpu.keyboard.key[6] = 0;
        };
        const press_right = ()=> {
            cpu.keyboard.key[6] = 1;
            cpu.keyboard.key[4] = 0;
        };
        const release = ()=> {
            cpu.keyboard.key[6] = 0;
            cpu.keyboard.key[4] = 0;
        };
        const cycle = ()=> {
            ball._x = ball.x;ball._y = ball.y;
            ball.x = cpu.v[6]; ball.y = cpu.v[7];
            platform.x = cpu.v[12];

            const dx = ball.x - platform.x - platform.center;
            if (dx > 1) {
                if (platform.x + platform.center*2 < 64)
                    press_right();
                else
                    release();
            }
            else if (dx < -1) {
                if (platform.x > 0)
                    press_left();
                else
                    release();
            }
            else
                release();
            bot_cycle_timeout = setTimeout(cycle, 0);
        };
        cycle();
    };

    this.play = (rom_name=this.romName)=>{
        if(this.roms.hasOwnProperty(rom_name)) {
            this.stop();
            this.romName=rom_name;
            this.roms[rom_name]();
        }
    };

    this.stop = ()=>{
        cpu.keyboard.clear();
        clearTimeout(bot_cycle_timeout);
    };
}