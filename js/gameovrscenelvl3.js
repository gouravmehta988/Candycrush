class GameOvrScene3 extends Phaser.Scene{
    constructor(){
        super("GameOvrScene3");
    }
    preload(){
        this.load.image("retry", "./assets/buttons/retrybtn.png");
        this.load.image("ovrbg", "./assets/ovrbg.png");
        this.load.image("ovrfish", "./assets/ovrfish.png");
        this.load.image("ovrstar", "./assets/ovrstar.png");
        this.load.image("scorebar", "./assets/scorebar.png");
        this.load.image("endgamebtn", "./assets/buttons/endgamebtn.png");
        this.load.image("winstar", "./assets/winstar.png");
    }

    init(data) {
        this.score = data.score || 0;
      }
    create(){

        //add bg
      this.add.image(0, 0, "ovrbg").setOrigin(0,0);

      //add text
      this.add.text(150, 100, "Game Over",{
        font: "90px bold",
        fontFamily: 'font1',
        fill: "#FFFFFF",
        align: "center"
    });
     //add 1st star
     this.add.image(290, 250, "winstar");
     //add 2nd star
     this.add.image(360, 250, "winstar");
     //add 3rd star
     this.add.image(430, 250, "ovrstar");

    //add fish
    this.add.image(360, 420, "ovrfish");

    //add score text
    this.add.text(360,640,'YOUR SCORE',{
        font: "30px bold font1",
        fill: "#FFFFFF",
        align: "center"
    }).setOrigin(0.5);

    //add score bar
    this.add.image(360, 710, "scorebar").setScale(1.3, 1.3);

    //add score text that will be updated from lvl1scene
    this.scoreText = this.add.text(360,710,this.score.toString(),{
        font: "80px bold font1",
        fill: "yellow",
        align: "center"
    }).setOrigin(0.5);

// add retry button
    this.add.image(450, 800, "retry").setInteractive().on("pointerdown", () => {
        this.scene.start("Lvl3Scene");
    });
    
    // add end game button
    this.add.image(270, 800, "endgamebtn").setInteractive().on("pointerdown", () => {
        this.scene.start("HomeScene");
    });
    }   

    update(){
       
    }
}