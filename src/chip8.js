"use strict";

function Chip8(){
    this.opcode;//current opcode
    this.memory = new Uint8Array(4096);//memory pool
    this.v = new Uint8Array(16);//registers
    this.I;//Index register
    this.pc;//Program counter
    this.delay_timer;//60hz
    this.sound_timer;//60hz
    this.stack = [];//stack for returns
    this.paused=false;
    this.keyboard;//Keypad
    this.screen;//screen device


    this.next = ()=>{
        if(!this.paused) {
            this.opcode = this.memory[this.pc] << 8 | this.memory[this.pc + 1];
            exec();
            if (this.delay_timer > 0)this.delay_timer--;
            if (this.sound_timer > 0)this.sound_timer--;
            this.screen.render();
        }
        setTimeout(this.next,0);
    };

    const exec = ()=>{
        this.pc+=2;
        console.log(this.opcode.toString(16));
        const x = (this.opcode & 0x0f00) >> 8;
        const y = (this.opcode & 0x00f0) >> 4;

        switch(this.opcode & 0xf000){
            case 0x000:
                switch(this.opcode){
                    /**
                     * 0x00e0
                     * Clear screen
                     */
                    case 0x00e0:
                        this.screen.clear();
                        break;
                    /**
                     * 0x00ee
                     * Return from subroutine
                     */
                    case 0x00ee:
                        this.pc = this.stack.pop();
                        break;
                }
                break;
            /**
             * 0x1nnn
             * Jump to nnn
             */
            case 0x1000:
                this.pc = this.opcode & 0x0fff;
                break;
            /**
             * 0x2nnn
             * Call subroutine at nnn
             */
            case 0x2000:
                this.stack.push(this.pc);
                this.pc = this.opcode & 0x0fff;
                break;
            /**
             * 0x3xkk
             * Skip next opcode if Vx == kk
             */
            case 0x3000:
                if(this.v[x] == (this.opcode & 0x00ff))
                    this.pc+=2;
                break;
            /**
             *  0x4xkk
             *  Skip next opcode if Vx != kk
             */
            case 0x4000:
                if(this.v[x] != (this.opcode & 0x00ff))
                    this.pc+=2;
                break;
            /**
             * 0x5xy0
             * Skip next opcode if Vx == Vy
             */
            case 0x5000:
                if(this.v[x] == this.v[y])
                    this.pc+=2;
                break;
            /**
             * 0x6xkk
             * Set Vx = kk
             */
            case 0x6000:
                this.v[x] = this.opcode & 0x00ff;
                break;
            /**
             * 0x7xkk
             * Set Vx = Vx + kk
             */
            case 0x7000:
                this.v[x] += this.opcode & 0x00ff;
                break;

            case 0x8000:
                switch(this.opcode & 0x000f) {
                    /**
                     * 0x8xy0
                     * Vx = Vy
                     */
                    case 0x0000:
                        this.v[x]=this.v[y];
                        break;
                    /**
                     * 0x8xy1
                     * Vx = Vx | Vy
                     */
                    case 0x0001:
                        this.v[x] = this.v[x] | this.v[y];
                        break;
                    /**
                     * 0x8xy2
                     * Vx = Vx & Vy
                     */
                    case 0x0002:
                        this.v[x] = this.v[x] & this.v[y];
                        break;
                    /**
                     * 0x8xy3
                     * Vx = Vx ^ Vy
                     */
                    case 0x0003:
                        this.v[x] = this.v[x] ^ this.v[y];
                        break;
                    /**
                     * 0x8xy4
                     * Vx = Vx + Vy, Vf = carry
                     */
                    case 0x0004:
                        const sum = this.v[x]+this.v[y];
                        if(sum>0xff)
                            this.v[0xf]=1;
                        else
                            this.v[0xf]=0;
                        this.v[x]=sum;
                        break;
                    /**
                     * 0x8xy5
                     * Vx = Vx - Vy, Vf = Not borrow
                     */
                    case 0x0005:
                        if(this.v[x]>this.v[y])
                            this.v[0xf]=1;
                        else
                            this.v[0xf]=0;
                        this.v[x]=this.v[x]-this.v[y];
                        break;
                    /**
                     * 0x8xy6
                     * Shifts VX right by one. VF is set to the value of the least significant bit of VX before the shift.
                     */
                    case 0x0006:
                        this.v[0xF] = this.v[x] & 0x01;
                        this.v[x] = this.v[x] >> 1;
                        break;
                    /**
                     * 0x8xy7
                     * Vx = Vy - Vx, Vf = Not borrow
                     */
                    case 0x0007:
                        if(this.v[x]>this.v[y])
                            this.v[0xf]=0;
                        else
                            this.v[0xf]=1;
                        this.v[x]=this.v[y]-this.v[x];
                        break;
                    /**
                     * 0x8xye
                     * Shifts VX left by one. VF is set to the value of the most significant bit of VX before the shift.[
                     */
                    case 0x000e:
                        this.v[0xf] = this.v[x] & 0x80;
                        this.v[x] = this.v[x] << 1;
                        break;
                }
                break;
            /**
             * 0x9xy0
             * Skip next opcode if Vx != Vy
             */
            case 0x9000:
                if(this.v[x]!=this.v[y])
                    this.pc+=2;
                break;
            /**
             * 0xannn
             * Set I = nnn
             */
            case 0xa000:
                this.I = this.opcode & 0x0fff;
                break;
            /**
             *  0xbnnn
             *  Jump to nnn + V0
             */
            case 0xb000:
                this.pc = (this.opcode & 0x0fff) + this.v[0];
                break;
            /**
             * 0xcxkk
             * Vx = random byte & kk
             */
            case 0xc000:
                this.v[x] = Math.floor(Math.random()*0xff) & (this.opcode & 0x00ff);
                break;
            /**
             * 0xdxyn
             * Display n-byte sprite starting at memory[I] at (Vx,Vy), Vf - collision
             */
            case 0xd000:
                let sprite;
                const width = 8;
                const height = this.opcode & 0x000F;
                this.v[0xf]=0;

                for(let row = 0; row < height; row++){
                    sprite = this.memory[this.I+row];
                    for(let col = 0; col < width; col++){
                        if((sprite & 0x80) > 0)
                            if (this.screen.setPixel(this.v[x] + col, this.v[y] + row))
                                this.v[0xf]=1;
                        sprite = sprite << 1;
                    }
                }
                break;

            case 0xe000:
                switch (this.opcode & 0x00ff){
                    /**
                     * 0xex9e
                     * Skip next opcode if key with value of Vx is pressed
                     */
                    case 0x009e:
                        if(this.keyboard.key[this.v[x]])
                            this.pc+=2;
                        break;
                    /**
                     * 0xexa1
                     * Skip next opcode if key with value of Vx is not pressed
                     */
                    case 0x00a1:
                        if(!this.keyboard.key[this.v[x]])
                            this.pc+=2;
                        break;
                }
                break;
            case 0xF000:
                switch (this.opcode & 0x00FF) {
                    /**
                     * 0xfx07
                     * Set Vx = delay timer
                     */
                    case 0x0007:
                        this.v[x] = this.delay_timer;
                        break;
                    /**
                     * 0xfx0a
                     * Wait for a key press and store it in Vx
                     */
                    case 0x000a:
                        this.paused = true;
                        this.keyboard.onNext(e=> {
                            this.v[x] = e;
                            this.paused = false;
                        });
                    /**
                     * 0xfx15
                     * Set delay timer = Vx
                     */
                    case 0x0015:
                        this.delay_timer = this.v[x];
                        break;
                    /**
                     * 0xfx18
                     * Set sound timer = Vx
                     */
                    case 0x0018:
                        this.sound_timer = this.v[x];
                        break;
                    /**
                     *  0xfx29
                     *  Set I = location of sprite for Vx
                     */
                    case 0x0029:
                        this.I = this.v[x] * 5;
                        break;
                    /**
                     * 0xfx33
                     * Store BCD representation of Vx in memory[I]
                     */
                    case 0x0033:
                        this.memory[this.I] = parseInt(this.v[x] / 100);
                        this.memory[this.I + 1] = parseInt(this.v[x] % 100 / 10);
                        this.memory[this.I + 2] = this.v[x] % 10;
                        break;
                    /**
                     * 0xfx55
                     * Store V0-Fx to memory[i]
                     */
                    case 0x0055:
                        for (let i = 0; i <= x; i++)
                            this.memory[this.I + i] = this.v[i];
                        break;
                    /**
                     * 0xfx65
                     * Read V0-Vx from memory[I]
                     */
                    case 0x0065:
                        for (let i = 0; i <= x; i++)
                            this.v[i] = this.memory[this.I + i];
                        break;
                    /**
                     * 0xfx1e
                     * Set I = I + Vx
                     */
                    case 0x001e:
                        this.I += this.v[x];
                        break;
                }
                break;
            default:
                console.log(`Unknow opcode: ${this.opcode.toString(16)} at ${this.pc}`);
        }
    };

    this.reset = ()=>{
        this.screen.clear();
        this.pc = 0x200;
        this.memory = new Uint8Array(4096);
        this.v = new Uint8Array(16);
        this.I=0;
        this.delay_timer=0;
        this.sound_timer=0;
        this.stack = [];
    };

    const loadRom = (buffer)=>{
        const rom = new Uint8Array(buffer);
        for(let i=0;i<rom.length;i++)
            this.memory[0x200+i]=rom[i];
        console.log(`Loaded ${rom.length} bytes of rom in memory`);
    };

    const loadFonts = ()=>{
        for(let i=0;i<_fontSet.length;i++)
            this.memory[i] = _fontSet[i];
    };

    this.init = (rom)=>{
        this.reset();
        loadFonts();
        loadRom(rom);
    }
}

const _fontSet = new Uint8Array([
    0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
    0x20, 0x60, 0x20, 0x20, 0x70, // 1
    0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
    0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
    0x90, 0x90, 0xF0, 0x10, 0x10, // 4
    0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
    0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
    0xF0, 0x10, 0x20, 0x40, 0x40, // 7
    0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
    0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
    0xF0, 0x90, 0xF0, 0x90, 0x90, // A
    0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
    0xF0, 0x80, 0x80, 0x80, 0xF0, // C
    0xE0, 0x90, 0x90, 0x90, 0xE0, // D
    0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
    0xF0, 0x80, 0xF0, 0x80, 0x80  // F
]);