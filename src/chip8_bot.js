"use strict";

function Chip8_bot(cpu){
    let bot_cycle_timeout;
    let current_rom_name="";
    const roms = {};
    /**
     * BRIX Game bot
     * cpu.v[6] - Ball x position
     * cpu.v[7] - Ball y position
     * cpu.v[12] - Platform x position
     */
    roms.BRIX = function(){
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
            const d = cpu.v[6] - cpu.v[12] - 3;
            if (d > 1) {
                if (cpu.v[12] + 6 < 64)
                    press_right();
                else
                    release();
            }
            else if (d < -1) {
                if (cpu.v[12] > 0)
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

    this.play = rom_name=>{
        if(roms.hasOwnProperty(rom_name)) {
            this.stop();
            current_rom_name=rom_name;
            roms[rom_name]();
        }
    };

    this.stop = ()=>{
        cpu.keyboard.clear();
        clearTimeout(bot_cycle_timeout);
    };
}