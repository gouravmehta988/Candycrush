class Lvl3Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Lvl3Scene' });
    this.levelConfig = null;
  }
  preload() {
    // Load assets.
    this.load.image('bg1', 'assets/bg1.png');
    this.load.image('tilebg', 'assets/tilebg.png');
    this.load.image('obj1', 'assets/obj1.png');
    this.load.image('obj2', 'assets/obj2.png');
    this.load.image('obj3', 'assets/obj3.png');
    this.load.image('obj4', 'assets/obj4.png');
    this.load.image('obj5', 'assets/obj5.png');
    this.load.image('lvl3', 'assets/lvl3icon.png');
    this.load.image('lvl2', 'assets/lvl2.png');
    this.load.image('lvlbg', 'assets/lvlbg.png');
    this.load.image('lvlhead', './assets/lvlheader.png');
    this.load.image('lvlcom', './assets/lvlcom.png');
    this.load.image('timeout', './assets/timeout.png');
    this.load.audio('destroy', './assets/sounds/destroy.mp3');
    this.load.audio('bg', './assets/sounds/bg.mp3');
    this.load.json('levelConfig', './js/config.json');
    this.load.image('re', './assets/reshuffle.png');
  }

  create() {
    // Score variables and display.
    let levelConfig = this.cache.json.get('levelConfig');
    console.log("Loaded JSON:", levelConfig);  // Debugging output
    if (!levelConfig || !levelConfig.level3) {
      console.error("Error: JSON file not loaded or invalid. Check the path and structure.");
      return;
    }
    let levelSettings = levelConfig.level3;
    console.log("Level settings:", levelSettings);  // Debugging output


    // Use JSON values instead of hardcoded values
    let timeRemaining3 = levelSettings.timeLimit3;
    let scoreTarget3 = levelSettings.scoreTarget3;
     // Ensure rows and columns do not exceed the maximum allowed values
     let rows = Math.min(levelSettings.rows, 8);
     let columns = Math.min(levelSettings.columns, 5);
    let score = 0;
    let scoreText = this.add.text(500, 70, '0', { font: '80px bold font1', fill: 'yellow' });
    scoreText.setDepth(3);


    let bgMusic = this.sound.add('bg', { loop: true });
    bgMusic.play();


    // Timer variables and display.
    // let timeRemaining = 60;
    let timerText = this.add.text(130, 130, 'Time: ' + timeRemaining3, { font: '35px bold font1', fill: 'white' });
    timerText.setDepth(3);

    // Update timer text every second.
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        timeRemaining3--;
        timerText.setText('Time: ' + timeRemaining3);
      },
      loop: true
    });
    // Timer: after 60 seconds, check the score and change scene accordingly.
    this.time.delayedCall(timeRemaining3*1000, () => {
      if (score >= scoreTarget3) {
        this.sound.add('divine');
        this.sound.play('divine');

        // Show the Level Completed image
        this.add.image(360, 540, 'lvlcom').setDepth(10).setScale(0.5, 0.5);

        // Wait 7 seconds before stopping music and changing scene
        this.time.delayedCall(1000, () => {
          bgMusic.stop();
          this.scene.stop('Lvl3Scene');
          this.scene.start('WinScene',{score: score});  // Move scene transition inside delay
        });

      } else {
        this.add.image(360, 540, 'timeout').setDepth(10).setScale(1.5, 1.5);
        this.time.delayedCall(2000, () => {
          bgMusic.stop();
          this.scene.start('GameOvrScene3', { score: score });
        });
      }
    }, [], this);

    // Level text and header.
    this.add.text(130, 75, 'Level 3', { font: '40px bold font1', fill: 'white' }).setDepth(3);
    this.add.image(360, 120, 'lvlhead').setDepth(2).setScale(1.8, 1.8);

    const isMobile = this.sys.game.config.width < 768; // Adjust based on mobile screen width
    const tileScale = isMobile ? 1.5 : 1; // Increase tile size on mobile
    const objScale = isMobile ? 1.5 : 1; // Increase object size on mobile

    const swipeThreshold = isMobile ? 30 : 20; // Increase threshold for mobile

    // const columns = 5;
    // const rows = 8;
    const boardWidth = 610;
    const boardHeight = 910;
    const cellWidth = boardWidth / columns;
    const cellHeight = boardHeight / rows;
    const boardYOffset = 250; // Vertical offset.
    const boardXOffset = 60; // Horizontal offset.
    let candies = [];  // 2D array to hold candy objects.
    const candyScale = 1;
    const objects = ['obj1', 'obj2', 'obj3', 'obj4', 'obj5'];

    // Add background image.
    this.add.image(0, 0, 'bg1').setOrigin(0, 0);

    // Draw a tile background for every grid cell.
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        let tileX = col * cellWidth + cellWidth / 2 + boardXOffset;
        let tileY = row * cellHeight + cellHeight / 2 + boardYOffset;
        this.add.image(tileX, tileY, 'tilebg').setOrigin(0.5).setDepth(1).setScale(tileScale);
      }
    }

    // Splash screens.
    let splash = this.add.image(360, 540, 'lvl3').setDepth(10);
    this.children.bringToTop(splash);
    this.time.delayedCall(1000, () => { splash.destroy(); });

    let splash1 = this.add.image(360, 540, 'lvl1iconbg').setDepth(9);
    this.children.bringToTop(splash1);
    this.time.delayedCall(1000, () => { splash1.destroy(); });

    let splash3 = this.add.image(0, 0, 'lvlbg').setDepth(8).setOrigin(0, 0);
    this.children.bringToTop(splash3);
    this.time.delayedCall(1000, () => { splash3.destroy(); });

    // Generate an array of all grid positions.
    let positions = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        positions.push({ row, col });
      }
    }
    Phaser.Utils.Array.Shuffle(positions);

    // Create candies and attach drag (swipe) events.
    positions.forEach((pos, index) => {
      let candyX = pos.col * cellWidth + cellWidth / 2 + boardXOffset;
      let candyY = pos.row * cellHeight + cellHeight / 2 + boardYOffset;
      let objKey = objects[index % objects.length];

      // Define a base size relative to screen size
      let baseWidth = cellWidth * 0.8; // 80% of cell width
      let baseHeight = cellHeight * 0.8; // 80% of cell height

      let candy = this.add.image(candyX, candyY, objKey)
        .setOrigin(0.5)
        .setInteractive({ draggable: true })
        .setDepth(2);

      // Set size uniformly across all objects
      candy.setDisplaySize(baseWidth, baseHeight);

      candy.row = pos.row;
      candy.col = pos.col;
      if (!candies[pos.row]) {
        candies[pos.row] = [];
      }
      candies[pos.row][pos.col] = candy;
      // Ensure any pre-existing matches are cleared, but only after showing them to the player
      this.time.delayedCall(500, () => {
        let initialMatches = checkMatches();
        if (initialMatches.length > 0) {
          removeMatches(initialMatches, true); // Pass 'true' to prevent score increase

          // Keep checking and clearing matches until none exist.
          const repeatMatchCheck = () => {
            let newMatches = checkMatches();
            if (newMatches.length > 0) {
              removeMatches(newMatches, true); // Again, prevent score increase
              this.time.delayedCall(350, repeatMatchCheck); // Check again after removing matches
            }
          };
          this.time.delayedCall(350, repeatMatchCheck);
        }
      });

      // Start drag: record initial pointer coordinates.
      candy.on('dragstart', (pointer) => {
        candy.swipeStartX = pointer.x;
        candy.swipeStartY = pointer.y;
      });

      // End drag: determine swipe direction and target candy.
      candy.on('dragend', (pointer) => {
        let deltaX = pointer.x - candy.swipeStartX;
        let deltaY = pointer.y - candy.swipeStartY;
        let absDeltaX = Math.abs(deltaX);
        let absDeltaY = Math.abs(deltaY);
        const swipeThreshold = 20;
        // If the movement is too short, reset candy to original position.
        if (absDeltaX < swipeThreshold && absDeltaY < swipeThreshold) {
          candy.x = candy.col * cellWidth + cellWidth / 2 + boardXOffset;
          candy.y = candy.row * cellHeight + cellHeight / 2 + boardYOffset;
          return;
        }
        // Determine swipe direction.
        let direction;
        if (absDeltaX > absDeltaY) {
          direction = deltaX > 0 ? 'right' : 'left';
        } else {
          direction = deltaY > 0 ? 'down' : 'up';
        }
        // Calculate target grid position.
        let targetRow = candy.row;
        let targetCol = candy.col;
        if (direction === 'left') {
          targetCol--;
        } else if (direction === 'right') {
          targetCol++;
        } else if (direction === 'up') {
          targetRow--;
        } else if (direction === 'down') {
          targetRow++;
        }
        // Validate target position.
        if (targetRow < 0 || targetRow >= rows || targetCol < 0 || targetCol >= columns) {
          candy.x = candy.col * cellWidth + cellWidth / 2 + boardXOffset;
          candy.y = candy.row * cellHeight + cellHeight / 2 + boardYOffset;
          return;
        }
        let adjacentCandy = candies[targetRow][targetCol];
        if (adjacentCandy) {
          swapCandies(candy, adjacentCandy);
        } else {
          candy.x = candy.col * cellWidth + cellWidth / 2 + boardXOffset;
          candy.y = candy.row * cellHeight + cellHeight / 2 + boardYOffset;
        }
      });
    });

    // --- MATCH-3 LOGIC FUNCTIONS ---

    const checkMatches = () => {
      let matches = [];
      // Horizontal matches.
      for (let row = 0; row < rows; row++) {
        let matchLength = 1;
        for (let col = 0; col < columns; col++) {
          let current = candies[row][col];
          let next = (col < columns - 1) ? candies[row][col + 1] : null;
          if (current && next && current.texture.key === next.texture.key) {
            matchLength++;
          } else {
            if (matchLength >= 3) {
              for (let i = col - matchLength + 1; i <= col; i++) {
                matches.push({ row: row, col: i });
              }
            }
            matchLength = 1;
          }
        }
      }
      // Vertical matches.
      for (let col = 0; col < columns; col++) {
        let matchLength = 1;
        for (let row = 0; row < rows; row++) {
          let current = candies[row][col];
          let next = (row < rows - 1) ? candies[row + 1][col] : null;
          if (current && next && current.texture.key === next.texture.key) {
            matchLength++;
          } else {
            if (matchLength >= 3) {
              for (let i = row - matchLength + 1; i <= row; i++) {
                matches.push({ row: i, col: col });
              }
            }
            matchLength = 1;
          }
        }
      }
      // Remove duplicates.
      let matchSet = new Set();
      matches.forEach(pos => {
        matchSet.add(`${pos.row}-${pos.col}`);
      });
      return Array.from(matchSet).map(str => {
        let parts = str.split('-');
        return { row: parseInt(parts[0]), col: parseInt(parts[1]) };
      });
    };

    const removeMatches = (matchPositions, isStartup = false) => {
      if (!isStartup) {
        // Only increase score during normal gameplay
        score += Math.floor(matchPositions.length / 3) * 10;
        scoreText.setText('' + score);
      }

      matchPositions.forEach(pos => {
        if (candies[pos.row][pos.col]) {
          candies[pos.row][pos.col].destroy();
          candies[pos.row][pos.col] = null;
          this.sound.add('destroy').play();
        }
      });

      dropCandies();
    };


    const dropCandies = () => {
      // Make candies fall.
      for (let col = 0; col < columns; col++) {
        for (let row = rows - 1; row >= 0; row--) {
          if (candies[row][col] === null) {
            for (let above = row - 1; above >= 0; above--) {
              if (candies[above][col] !== null) {
                let movingCandy = candies[above][col];
                candies[row][col] = movingCandy;
                candies[above][col] = null;
                movingCandy.row = row;
                let newY = row * cellHeight + cellHeight / 2 + boardYOffset;
                this.tweens.add({
                  targets: movingCandy,
                  y: newY,
                  duration: 300,
                  ease: 'Power2'
                });
                break;
              }
            }
          }
        }
      }
      // Fill empty cells with new candies.
      for (let col = 0; col < columns; col++) {
        for (let row = 0; row < rows; row++) {
          if (candies[row][col] === null) {
            let candyX = col * cellWidth + cellWidth / 2 + boardXOffset;
            let startY = boardYOffset - cellHeight / 2;
            let objKey = Phaser.Utils.Array.GetRandom(objects);

            // Set base size
            let baseWidth = cellWidth * 0.8;
            let baseHeight = cellHeight * 0.8;

            let newCandy = this.add.image(candyX, startY, objKey)
              .setOrigin(0.5)
              .setInteractive({ draggable: true })
              .setDisplaySize(baseWidth, baseHeight) // Maintain consistent size
              .setDepth(2);
            newCandy.row = row;
            newCandy.col = col;
            candies[row][col] = newCandy;
            let targetY = row * cellHeight + cellHeight / 2 + boardYOffset;
            this.tweens.add({
              targets: newCandy,
              y: targetY,
              duration: 300,
              ease: 'Power2'
            });
            // Attach drag events to new candies.
            newCandy.on('dragstart', (pointer) => {
              newCandy.swipeStartX = pointer.x;
              newCandy.swipeStartY = pointer.y;
            });
            newCandy.on('dragend', (pointer) => {
              let deltaX = pointer.x - newCandy.swipeStartX;
              let deltaY = pointer.y - newCandy.swipeStartY;
              let absDeltaX = Math.abs(deltaX);
              let absDeltaY = Math.abs(deltaY);
              const swipeThreshold = 20;
              if (absDeltaX < swipeThreshold && absDeltaY < swipeThreshold) {
                newCandy.x = newCandy.col * cellWidth + cellWidth / 2 + boardXOffset;
                newCandy.y = newCandy.row * cellHeight + cellHeight / 2 + boardYOffset;
                return;
              }
              let direction;
              if (absDeltaX > absDeltaY) {
                direction = deltaX > 0 ? 'right' : 'left';
              } else {
                direction = deltaY > 0 ? 'down' : 'up';
              }
              let targetRow = newCandy.row;
              let targetCol = newCandy.col;
              if (direction === 'left') {
                targetCol--;
              } else if (direction === 'right') {
                targetCol++;
              } else if (direction === 'up') {
                targetRow--;
              } else if (direction === 'down') {
                targetRow++;
              }
              if (targetRow < 0 || targetRow >= rows || targetCol < 0 || targetCol >= columns) {
                newCandy.x = newCandy.col * cellWidth + cellWidth / 2 + boardXOffset;
                newCandy.y = newCandy.row * cellHeight + cellHeight / 2 + boardYOffset;
                return;
              }
              let adjacentCandy = candies[targetRow][targetCol];
              if (adjacentCandy) {
                swapCandies(newCandy, adjacentCandy);
              } else {
                newCandy.x = newCandy.col * cellWidth + cellWidth / 2 + boardXOffset;
                newCandy.y = newCandy.row * cellHeight + cellHeight / 2 + boardYOffset;
              }
            });
          }
        }
      }
      // Check for cascaded matches after drop.
      this.time.delayedCall(350, () => {
        let newMatches = checkMatches();
        if (newMatches.length > 0) {
          removeMatches(newMatches);
        }
      });
    };
    let reshuffleUsed = false; // Track if reshuffle has been used

    // Add Reshuffle Button
    let reshuffleBtn = this.add.image(360, 1220, 're', {
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    })
      .setScale(0.3)
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(3);

    reshuffleBtn.on('pointerdown', () => {
      if (!reshuffleUsed) {
        reshuffleGrid();  // Perform reshuffle ONCE
        reshuffleUsed = true; // Prevent future reshuffles
        reshuffleBtn.setAlpha(0.5).disableInteractive(); // Visually disable button
      }
    });


    const reshuffleGrid = () => {
      let allCandies = [];

      // Collect all candies into an array
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          if (candies[row][col]) {
            allCandies.push(candies[row][col]);
          }
        }
      }

      let validShuffle = false;

      while (!validShuffle) {
        // Shuffle the candies array
        Phaser.Utils.Array.Shuffle(allCandies);

        // Temporarily assign shuffled positions to check for matches
        let tempCandies = [];
        let index = 0;
        for (let row = 0; row < rows; row++) {
          tempCandies[row] = [];
          for (let col = 0; col < columns; col++) {
            let candy = allCandies[index++];
            candy.row = row;
            candy.col = col;
            tempCandies[row][col] = candy;
          }
        }

        // Check if the new shuffled board has matches
        let newMatches = checkMatches(tempCandies);
        if (newMatches.length === 0) {
          validShuffle = true; // Accept this shuffle if no matches are found
        }
      }

      // Apply the valid shuffle to the real board
      let index = 0;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          let candy = allCandies[index++];
          candies[row][col] = candy;

          let newX = col * cellWidth + cellWidth / 2 + boardXOffset;
          let newY = row * cellHeight + cellHeight / 2 + boardYOffset;

          this.tweens.add({
            targets: candy,
            x: newX,
            y: newY,
            duration: 500,
            ease: 'Power2'
          });
        }
      }
    };

    const swapCandies = (candyA, candyB) => {
      let rowA = candyA.row, colA = candyA.col;
      let rowB = candyB.row, colB = candyB.col;

      // Swap candies in the grid array
      candies[rowA][colA] = candyB;
      candies[rowB][colB] = candyA;

      // Swap their row & col properties
      candyA.row = rowB;
      candyA.col = colB;
      candyB.row = rowA;
      candyB.col = colA;

      let newAX = candyA.col * cellWidth + cellWidth / 2 + boardXOffset;
      let newAY = candyA.row * cellHeight + cellHeight / 2 + boardYOffset;
      let newBX = candyB.col * cellWidth + cellWidth / 2 + boardXOffset;
      let newBY = candyB.row * cellHeight + cellHeight / 2 + boardYOffset;

      // Animate the swap
      this.tweens.add({
        targets: candyA,
        x: newAX,
        y: newAY,
        duration: 300,
        ease: 'Power2'
      });

      this.tweens.add({
        targets: candyB,
        x: newBX,
        y: newBY,
        duration: 300,
        ease: 'Power2',
        onComplete: () => {
          let matches = checkMatches();
          if (matches.length > 0) {
            removeMatches(matches);
          } else {
            // Reverse the swap if no match is found
            candies[rowA][colA] = candyA;
            candies[rowB][colB] = candyB;

            candyA.row = rowA;
            candyA.col = colA;
            candyB.row = rowB;
            candyB.col = colB;

            this.tweens.add({
              targets: candyA,
              x: colA * cellWidth + cellWidth / 2 + boardXOffset,
              y: rowA * cellHeight + cellHeight / 2 + boardYOffset,
              duration: 300,
              ease: 'Power2'
            });

            this.tweens.add({
              targets: candyB,
              x: colB * cellWidth + cellWidth / 2 + boardXOffset,
              y: rowB * cellHeight + cellHeight / 2 + boardYOffset,
              duration: 300,
              ease: 'Power2'
            });
          }
        }
      });
    }
  }
  resize(newWidth, newHeight) {
    this.cameras.resize(newWidth, newHeight);

    let newCellWidth = newWidth / 5; // Adjust for columns
    let newCellHeight = newHeight / 8; // Adjust for rows
    let newBaseWidth = newCellWidth * 0.8;
    let newBaseHeight = newCellHeight * 0.8;

    for (let row = 0; row < candies.length; row++) {
      for (let col = 0; col < candies[row].length; col++) {
        let candy = candies[row][col];
        if (candy) {
          let newX = col * newCellWidth + newCellWidth / 2 + boardXOffset;
          let newY = row * newCellHeight + newCellHeight / 2 + boardYOffset;
          candy.setPosition(newX, newY);
          candy.setDisplaySize(newBaseWidth, newBaseHeight);
        }
      }
    }
  }
  update() {
    // Update logic if needed.
  }
}