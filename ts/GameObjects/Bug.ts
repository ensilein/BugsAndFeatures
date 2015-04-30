/// <reference path="../../phaserLib/phaser.d.ts"/>
module Sprites // very important - not even constructor gets called without this...
{
    export class Bug extends Phaser.Sprite
    {
        public static MAX_SPEED: number = 30; // 30 fps

        currentKey: Phaser.Key;

        animName: string;

        firstBoost: boolean;

        constructor(game: Phaser.Game, animName: string, x:number,y:number)
        {
            super(game,x,y, animName);

            this.setAnimName(animName);

            this.currentKey = null;
            this.setFirstBoost(true);

            //this.anchor.set(0.5, 0.5);

        }

        setCurrentKey(key: Phaser.Key)
        {
            this.currentKey = key;
        }

        setAnimName(name: string)
        {
            this.animName = name;
        }

        isFirstBoost(): boolean
        {
            return this.firstBoost;
        }

        setFirstBoost(val: boolean)
        {
            this.firstBoost = val;
        }

        getCurrentKey(): Phaser.Key
        {
            return this.currentKey;
        }

        getAnimName(): string
        {
            return this.animName;
        }

        boost(velocity: number)
        {

            if (this.currentKey == null) return;

            // initial boost
            if (this.isFirstBoost())
            {
                this.body.velocity.setTo(0, -270);
                this.setFirstBoost(false); // unset forst boost
                return;
            }

            if (this.currentKey.isDown) this.body.velocity.setTo(0, velocity);
        }

        update()
        {

        }

        Animate()
        {
            //console.log("animate called");
            this.loadTexture(this.animName,0);
            this.animations.add("move"); // whole sheet = move animation
            this.animations.play("move", 10, true); // true -> loop forever
            this.animations.currentAnim.speed = 10;
        }

    }
}

