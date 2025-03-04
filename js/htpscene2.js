class HtpScene2 extends Phaser.Scene {
    constructor() {
        super({ key: 'HtpScene2' });
    }

    preload() {
        this.load.image('htp1', 'assets/htp1.png');
        this.load.image('htp2', 'assets/htp2.png');
        this.load.image('nextbtn','assets/buttons/nextbtn.png');
        this.load.image('closebtn','assets/buttons/closebtn.png');
    }

    create() {
        this.add.image(0, 0, 'htp2').setOrigin(0, 0);

        this.add.image(360, 1150, 'closebtn').setScale(1.5,1.5).setInteractive().on('pointerdown', () => {
            this.scene.stop('HtpScene2');
            this.scene.start('HomeScene');
        });
    }
}