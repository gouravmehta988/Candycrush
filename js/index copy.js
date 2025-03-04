window.onload = function () {
    var isMobile = navigator.userAgent.indexOf("Mobile") !== -1 || navigator.userAgent.indexOf("Tablet") !== -1;

    var w = window.innerWidth;
    var h = window.innerHeight;

    if (isMobile) {
        w = window.screen.width;
        h = window.screen.height;
    }

    var config = {
        type: Phaser.CANVAS,
        width: 720,
        height: 1280,
        parent: 'game',
        scale: {
            mode: isMobile ? Phaser.Scale.ENVELOP : Phaser.Scale.FIT, // Use FIT only for PC
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        scene: [
            HomeScene,
            Lvl1Scene,
            Lvl2Scene,
            Lvl3Scene,
            GameOvrScene,
            GameOvrScene2,
            GameOvrScene3,
            WinScene,
            HtpScene,
            HtpScene2
        ]
    };

    var game = new Phaser.Game(config);

    // Adjust game size dynamically when screen resizes (PC only)
    if (!isMobile) {
        window.addEventListener('resize', () => {
            let newWidth = window.innerWidth;
            let newHeight = window.innerHeight;
            game.scale.resize(newWidth, newHeight);
        });
    }

    // Ensure assets resize properly
    Phaser.Scene.prototype.resize = function (width, height) {
        this.cameras.resize(width, height);
        if (this.background) {
            this.background.setDisplaySize(width, height);
        }
    };
};
