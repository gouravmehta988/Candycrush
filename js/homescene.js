class HomeScene extends Phaser.Scene{
    constructor(){
        super("HomeScene");
    }
    preload(){
        this.load.image("bg", "./assets/bg.png");
        this.load.image("asdf", "assets/asdf.jpg");
        this.load.image("htpbtn", "./assets/buttons/htpbtn.png");
        this.load.image("playbtn", "./assets/buttons/playbtn.png");
    }
    create(){
        this.add.image(window.width, window.height, "bg").setOrigin(0,0);
        this.add.text(150, 160, "Match similar waste\nitems to clean up the\n ocean and help sea\n creatures.",{
            font: "50px bold font1",
            fill: "#FFFFFF",
            align: "center"
        });
        // How to play button
        var loadbtn = this.add.image(230, 480, "htpbtn").setScale(1.3);
        loadbtn.on('pointerdown', function(){
            this.scene.start("HtpScene");
        }, this);
        loadbtn.setInteractive();

        // Play button
        var playbtn = this.add.image(490, 480, "playbtn").setScale(1.3);
        playbtn.on('pointerdown', function(){
            this.scene.start("Lvl1Scene");
        }, this);
        playbtn.setInteractive();
        
        
    }   

    resize(newWidth, newHeight) {
        this.cameras.resize(newWidth, newHeight);

        if (this.background) {
            this.background.setDisplaySize(newWidth, newHeight);
        }

        if (this.startButton) {
            this.startButton.setPosition(newWidth / 2, newHeight * 0.8);
            this.startButton.setScale(newWidth / 720);
        }
    }
    update(){
        // this.scene.start("GameScene");
    }
}