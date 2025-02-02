/// <reference path="../../phaserLib/phaser.d.ts"/>
/// <reference path="../GameObjects/Bug.ts"/>
/// <reference path="../Utils/GameSettings.ts"/>
/// <reference path="../Utils/UtilFunctions.ts"/>
module States
{
    export class MenuState extends Phaser.State {
        game:Phaser.Game;

        START_BUTTON1:Phaser.Key;
        START_BUTTON2:Phaser.Key;

        bg:Phaser.TileSprite;

        enter: Phaser.Sprite;

        bugs:Array<Sprites.Bug>;
        chosen:Array <boolean>;

        s1:Phaser.Sound;
        squeaks:Array<Phaser.Sound>;

        create() {

            this.bg = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, "bg_neu");

            // blinking enter
            this.enter = this.game.add.sprite(this.game.width * 0.92, this.game.height * 0.86, "enter");
            this.enter.anchor.setTo(0.5,0.5);
            this.enter.scale.x = 0.40;
            this.enter.scale.y = 0.40;
            this.enter.alpha = 0;
            this.game.add.tween(this.enter).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

            this.s1 = this.game.add.audio('menunew', 1, true);
            this.s1.play();
            this.squeaks = [
                this.game.add.audio('squeak', 1 ,false),
                this.game.add.audio('squeak2', 1, false)
            ];

            var line1 = "Pick at least 2 Bugs!";
            var style = GameSettings.getTextStyle(GameSettings.TextStyles.STYLE_RED,60);
            this.game.add.text(this.game.width * 0.3, 60, line1, style);

            this.START_BUTTON1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.START_BUTTON1.onDown.add(MenuState.prototype.buttonPressed, this);
            this.START_BUTTON2 = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.START_BUTTON2.onDown.add(MenuState.prototype.buttonPressed, this);
            this.bugs = new Array<Sprites.Bug>(GameSettings.getBugNamesArray().length);

            // for now easier to hard code than to calculate right
            this.bugs = [
                new Sprites.Bug(this.game,0, "BUG0_MOVING", this.game.width*0.2, this.game.height  *0.4),
                new Sprites.Bug(this.game,1, "BUG1_MOVING", this.game.width*0.35, this.game.height *0.65),
                new Sprites.Bug(this.game,2, "BUG2_MOVING", this.game.width*0.5, this.game.height *0.4),
                new Sprites.Bug(this.game,3, "BUG3_MOVING", this.game.width*0.65, this.game.height *0.65),
                new Sprites.Bug(this.game,4, "BUG4_MOVING", this.game.width*0.8, this.game.height *0.4)
            ];

            // add bug names below bugs
            var style2 = GameSettings.getTextStyle(GameSettings.TextStyles.STYLE_RED,40);
            var currentKey = this.bugs[0].getID()+1;
            var name1 = currentKey++ +" - "+this.bugs[0].getName();
            this.game.add.text(this.game.width*0.15, this.game.height  *0.50, name1, style2);
            var name2 = currentKey++ +" - "+this.bugs[1].getName();
            this.game.add.text(this.game.width*0.26, this.game.height  *0.75, name2, style2);
            var name3 = currentKey++ +" - "+this.bugs[2].getName();
            this.game.add.text(this.game.width*0.43, this.game.height  *0.50, name3, style2);
            var name4 = currentKey++ +" - "+this.bugs[3].getName();
            this.game.add.text(this.game.width*0.56, this.game.height  *0.75, name4, style2);
            var name5 = currentKey++ +" - "+this.bugs[4].getName();
            this.game.add.text(this.game.width*0.73, this.game.height  *0.50, name5, style2);

            // chosen bugs
            this.chosen = Array<boolean>(this.bugs.length);
            for (var i =0; i<this.chosen.length;i++)
            {
                this.chosen[i] = false;
            }

            // add bugs to game
            for (var i = 0; i < this.bugs.length; i++)
            {
                this.bugs[i].scale.x = 0.3;
                this.bugs[i].scale.y = 0.3;
                this.bugs[i].anchor.setTo(.5,.5);
                this.game.add.existing(this.bugs[i]); // add bug to scene
                this.bugs[i].inputEnabled = true;
            }

        }

        update()
        {
            // check if bugs are clicked
            for (var i=0;i<this.bugs.length;i++)
            {
                if (this.bugs[i].isSelected()) this.bugs[i].animate();
                else this.bugs[i].stopAnimation();
                this.chosen[i] = this.bugs[i].isSelected();
            }

        }

        buttonPressed() {

            var bugsSelected =0 ;
            var chosenAnimName = Array();
            this.squeaks[Math.floor(Math.random() * 2)].play();
            for (var i = 0; i < this.chosen.length; i++) {
                if (this.chosen[i]) {
                    chosenAnimName.push(this.bugs[i].getAnimName());
                    bugsSelected++;
                }
            }

            if (bugsSelected < 2) {
                //this.fadeFadeText("Choose at least 2 bugs.");
                return;
            }

            this.sound.stopAll();

            this.game.state.states['GameScreenState'].setBugs(chosenAnimName);
            this.game.tweens.removeFrom(this.enter); // remove enter tween
            this.game.state.start("GameScreenState");

        }

    }
}
