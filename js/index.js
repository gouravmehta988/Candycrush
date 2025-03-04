window.onload = function () {
    var isMobile = navigator.userAgent.indexOf("Mobile") !== -1 || navigator.userAgent.indexOf("Tablet") !== -1;

    // Game Configuration
    var config = {
        type: Phaser.AUTO,
        width: isMobile ? window.innerWidth : 720, // Keep fixed size on PC, dynamic on mobile
        height: isMobile ? window.innerHeight : 1280,
        parent: 'game',
        scale: {
            mode: isMobile ? Phaser.Scale.RESIZE : Phaser.Scale.FIT, // Resize for mobile, FIT for PC
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

    // Function to go fullscreen (ONLY for mobile)
    function goFullscreen() {
        if (isMobile && !document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.warn("Error attempting fullscreen:", err.message);
            });
        }
    }

    // Enter fullscreen ONLY on mobile
    if (isMobile) {
        setTimeout(goFullscreen, 500);
    }

    // Resize game and adjust assets when window size changes
    window.addEventListener('resize', () => {
        game.scale.resize(window.innerWidth, window.innerHeight);
        resizeAssets();
    });

    // Resize assets dynamically inside Phaser scenes
    Phaser.Scene.prototype.resize = function (width, height) {
        this.cameras.resize(width, height);
        resizeAssets();
    };

    // Function to adjust assets dynamically
    function resizeAssets() {
        let scenes = game.scene.scenes;
        scenes.forEach(scene => {
            let w = window.innerWidth;
            let h = window.innerHeight;

            if (scene.background) {
                scene.background.setDisplaySize(w, h); // Scale background
            }
            if (scene.scoreText) {
                scene.scoreText.setFontSize(w * 0.05); // Adjust text size dynamically
            }
            if (scene.playBtn) {
                scene.playBtn.setPosition(w / 2, h * 0.8);
                scene.playBtn.setScale(w / 720);
            }
        });
    }
};
