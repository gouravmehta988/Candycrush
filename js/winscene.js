class WinScene extends Phaser.Scene{
    constructor(){
        super("WinScene");
    }
    preload(){
        this.load.image("retry", "./assets/buttons/retrybtn.png");
        this.load.image("winbg", "./assets/winbg.png");
        this.load.image("ovrfish", "./assets/ovrfish.png");
        this.load.image("winfish", "./assets/winfish.png");
        this.load.image("winstar", "./assets/winstar.png");
        this.load.image("scorebar", "./assets/scorebar.png");
        this.load.image("endgamebtn", "./assets/buttons/endgamebtn.png");
        this.load.image("playagain", "./assets/buttons/playagainbtn.png");
        this.load.audio("win", "./assets/sounds/win.mp3");
    }

    init(data) {
        this.score = data.score || 0;
      }
    create(){

        this.playWin = this.sound.add("win");
        this.playWin.play();

        //add bg
      this.add.image(0, 0, "winbg").setOrigin(0,0);

      //add text
      this.add.text(220, 100, "YOU WIN!",{
        font: "60px font1",
        fill: "#FFFFFF",
        align: "center"
    });
     //add 1st star
     this.add.image(290, 200, "winstar");
     //add 2nd star
     this.add.image(360, 200, "winstar");
     //add 3rd star
     this.add.image(430, 200, "winstar");

    //add fish
    this.add.image(360, 350, "winfish");

    //add score text
    this.add.text(360,510,'YOUR SCORE',{
        font: "30px font1",
        fill: "#FFFFFF",
        align: "center"
    }).setOrigin(0.5);

    //add score bar
    this.add.image(360, 570, "scorebar").setScale(1.3, 1.3);

    //add score text that will be updated from lvl1scene
    this.scoreText = this.add.text(360,570,this.score.toString(),{
        font: "80px bold font1",
        fill: "yellow",
        align: "center"
    }).setOrigin(0.5);

// add retry button
    this.add.image(450, 650, "playagain").setInteractive().on("pointerdown", () => {
        this.scene.start("Lvl1Scene");
    });
    
    // add end game button
    this.add.image(270, 650, "endgamebtn").setInteractive().on("pointerdown", () => {
        this.scene.start("HomeScene");
    });
    }   

    update(){
       
    }
}