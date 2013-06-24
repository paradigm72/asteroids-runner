ig.module(
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

    'game.entityFactory',
    'game.shieldMeter',

	'game.entities.ship',
	'game.entities.asteroid',
    'game.entities.shield',
	
    'plugins.logicalCoords',
    'plugins.entity_spawnPosCheck',
    'plugins.empika.debug_display',
    'plugins.touch-button',

	
    'game.levels.levelOne'
)
.defines(function(){

	
//pre-constructor constants
var MAX_SCREEN_HEIGHT = 640;  //adjusts to fill device height, up to this amount
var SCREEN_WIDTH = 320;
var ZOOM_FACTOR = 1;
var SPAWN_OFFSET = -192;

MainGame = ig.Game.extend({
	
	
	// Load a font
	scoreFont: new ig.Font('media/scoreFont.png'),
    titleFont: new ig.Font('media/titleFont.png'),
	
	//Current score, starts at zero
	score: 0,
	
	//Game state, -1 if player is dead, 0 otherwise
	gameStateEnum: {
        'active': 0,
        'playerDead_ready': -1,
        'playerDead_lockedOut': -2,
        'paused': 1
    },

    //Game stats, for display on summary screen
    gameStats: {
        asteroidsDestroyed: 0,
        shotsFired: 0
    },

    //keep track of how long the level has been running
    gameSpeedTimer: new ig.Timer(),
	
	//Constants for the game level
	consts: {
		screenHeight: MAX_SCREEN_HEIGHT,
		screenWidth: SCREEN_WIDTH,
		zoomFactor: ZOOM_FACTOR,
        spawnOffset: SPAWN_OFFSET
	},

    //for the summary screen (after player death)
    replayButton: new ig.Image('media/buttons/button_green.png'),
    mainMenuButton: new ig.Image('media/buttons/button_red.png'),
    backgroundImage: new ig.Image('media/black_background.png'),

    //shield assets
    shieldMeterImg: new ig.Image('media/shield/shieldMeter.png'),
    shieldBlackImg: new ig.Image('media/shield/shieldBlack.png'),


    init: function() {

        //Update the "screen height" for other code that references it
        this.consts.screenHeight = Math.min(window.innerHeight, this.consts.screenHeight);

		this.loadLevel( LevelLevelOne );

        //Initial value for the game state: active, playing.
        this.gameState = this.gameStateEnum.active;

        //Helper object to handle spawning new asteroids/walls for us
        this.entityFactory = new EntityFactory;

        //Helper object to handle updating the shield strength meter
        this.shieldMeter = new ShieldMeter;
        this.shieldMeter.toggleShieldCallback = this.event_toggleShieldCallback;
        this.shieldMeter.fadingShieldCallback = this.event_fadingShieldCallback

        this.initInputBindings();
        this.initBackgroundMapScrolling();

        //frames per second
        this.debugDisplay = new DebugDisplay(this.scoreFont);

	},

    loadLevel: function(level) {
        this.parent(level);
        if (ig.ua.mobile) {
            for (var i=0; i < this.backgroundMaps.length; i++) {
                this.backgroundMaps[i].chunkSize = 256;
                this.backgroundMaps[i].preRender = true;
            }
        }
    },
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		//spawn asteroids and walls
		this.entityFactory.spawnRandomObstacles("EntityAsteroid", '10%');
		this.entityFactory.spawnRandomObstacles("EntityWall", '5%');

        //update shield strength
        this.shieldMeter.update();
		
		this.scrollBackgroundMap();
                        
        //if the player is dead and the wait timer has passed, allow replay/exit
        if (this.gameState === this.gameStateEnum.playerDead_ready) {

            if (ig.input.pressed('replay')) {
                var buttonSound = ig.soundManager.get('media/sounds/menu_button.mp3');
                buttonSound.play();
                this.resetGame();
            }
            else if (ig.input.pressed('mainMenu')) {
                var buttonSound = ig.soundManager.get('media/sounds/menu_button.mp3');
                buttonSound.play();
                ig.system.setGameNow(TitleScreen);
            }
        }
        //otherwise if the player is dead, check whether the wait timer has passed
        else if (this.gameState === this.gameStateEnum.playerDead_lockedOut) {
            if (this.lockoutTimer.delta() >= 1) {
                this.gameState = this.gameStateEnum.playerDead_ready;
                delete this.lockoutTimer;
            }
        }
		
	},

    resetGame: function() {
        this.gameState = 0;
        this.score = 0;
        this.gameStats.shotsFired = 0;
        this.gameStats.asteroidsDestroyed = 0;
        this.loadLevel( LevelLevelOne);
        this.gameSpeedTimer.reset();
        this.shieldMeter.reset();
    },
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		// Draw the current score			
		this.scoreFont.draw( this.score, 10, 10, ig.Font.ALIGN.LEFT);

        // Draw the shield meter w/its current strength
        this.drawShieldMeter();

        //Draw debug info
        this.debugDisplay.draw([], true);

		// If player is dead, show Reload text
		if (this.gameState === this.gameStateEnum.playerDead_ready) {
            this.backgroundImage.draw(0, 0);
            this.scoreFont.draw( "You have died",
                                       this.consts.screenWidth * 0.5,
                                       this.LogicalToPixelY(15),
                                       ig.Font.ALIGN.CENTER);
            this.scoreFont.draw("Asteroids destroyed: ",
                           this.LogicalToPixelX(5), this.LogicalToPixelY(35), ig.Font.ALIGN.LEFT);
            this.scoreFont.draw("Shots fired: ",
                           this.LogicalToPixelX(5), this.LogicalToPixelY(45), ig.Font.ALIGN.LEFT);
            this.scoreFont.draw("Time survived: ",
                           this.LogicalToPixelX(5), this.LogicalToPixelY(55), ig.Font.ALIGN.LEFT);
            this.scoreFont.draw("Total score: ",
                           this.LogicalToPixelX(5), this.LogicalToPixelY(65), ig.Font.ALIGN.LEFT);

            this.scoreFont.draw(this.gameStats.asteroidsDestroyed,
                this.LogicalToPixelX(90), this.LogicalToPixelY(35), ig.Font.ALIGN.RIGHT);
            this.scoreFont.draw(this.gameStats.shotsFired,
                this.LogicalToPixelX(90), this.LogicalToPixelY(45), ig.Font.ALIGN.RIGHT);
            this.scoreFont.draw(Math.round(this.gameSpeedTimer.delta()*100)/100 + "s",
                this.LogicalToPixelX(90), this.LogicalToPixelY(55), ig.Font.ALIGN.RIGHT);
            this.scoreFont.draw(this.score,
                this.LogicalToPixelX(90), this.LogicalToPixelY(65), ig.Font.ALIGN.RIGHT);

            var replayButtonY = this.LogicalToPixelY(80)
            this.replayButton.draw(this.LogicalToPixelX(25) - this.replayButton.width / 2, replayButtonY);
            this.titleFont.draw("RETRY", this.LogicalToPixelX(25), replayButtonY, ig.Font.ALIGN.CENTER);

            var mainMenuButtonY = this.LogicalToPixelY(80);
            this.mainMenuButton.draw(this.LogicalToPixelX(75) - this.mainMenuButton.width / 2, mainMenuButtonY);
            this.titleFont.draw("MENU", this.LogicalToPixelX(75), mainMenuButtonY, ig.Font.ALIGN.CENTER);
        }
	},

    initInputBindings: function () {
        ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
        ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
        //ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
        //ig.input.bind(ig.KEY.UP_ARROW, 'up');
        ig.input.bind(ig.KEY.SPACE, 'shoot');

        //for mobile
        if (ig.ua.mobile) {
            ig.input.initAccelerometer();
            new ig.TouchButton('shoot', 0, 0, this.consts.screenWidth, this.consts.screenHeight);
        }

        //log accelerometer data to XCode console
        /*document.addEventListener('devicemotion', function (ev) {
            var accel = ev.accelerationIncludingGravity;
            console.log(accel.x, accel.y, accel.z);
        }, false);*/

        //buttons for the summary screen (after player death)
        if (ig.ua.mobile) {
            var replayButtonDims = {
                x: this.LogicalToPixelX(30) - this.replayButton.width / 2,
                y: this.LogicalToPixelY(80),
                width: this.replayButton.width,
                height: this.replayButton.height
            };
            new ig.TouchButton('replay', replayButtonDims.x, replayButtonDims.y,
                replayButtonDims.width, replayButtonDims.height);

            var mainMenuButtonDims = {
                x: this.LogicalToPixelX (70) - this.mainMenuButton.width / 2,
                y: this.LogicalToPixelY(80),
                width: this.mainMenuButton.width,
                height: this.mainMenuButton.height
            };
            new ig.TouchButton('mainMenu', mainMenuButtonDims.x, mainMenuButtonDims.y,
                mainMenuButtonDims.width, mainMenuButtonDims.height);
        }
        else {
            //no usability hinting for this, really just for debugging
            ig.input.bind(ig.KEY.ENTER, 'replay');
            ig.input.bind(ig.KEY.BACKSPACE, 'mainMenu');
        }
    },



	
	initBackgroundMapScrolling: function () {
		//set up background map so it scrolls
		var myBGMap = ig.game.backgroundMaps[0];
		myBGMap.setScreenPos(ig.game.screen.x, ig.game.screen.y);
		var myStarLayer = ig.game.backgroundMaps[1];
		myStarLayer.setScreenPos(ig.game.screen.x, ig.game.screen.y / myStarLayer.distance);
	},
	
	scrollBackgroundMap: function () {
		//scroll background map
		ig.game.screen.y -= 1;
		var myBGMap = ig.game.backgroundMaps[0];
		myBGMap.setScreenPos(0, myBGMap.scroll.y - 1);
		var myStarLayer = ig.game.backgroundMaps[1];
		myStarLayer.setScreenPos(0, myStarLayer.scroll.y - 1);
	},

    drawShieldMeter: function() {

        //don't draw if the player is dead
        if (this.gameState === this.gameStateEnum.playerDead_ready ||
            this.gameState === this.gameStateEnum.playerDead_lockedOut) {
            return;
        }

        //first draw the 'full' bar (white rect w/rounded corners?)
        this.shieldMeterImg.draw((this.consts.screenWidth - this.shieldMeterImg.width) / 2,
                                 this.consts.screenHeight - this.shieldMeterImg.height - 10);


        //then figure out how much of the bar should be obscured by the blocking
        //texture (use a black matte)
        var shieldPercent = this.shieldMeter.currentShieldStrength / this.shieldMeter.consts.maxShieldStrength;
        var blackStartPos = Math.ceil(shieldPercent * (this.shieldMeterImg.width));
        if (blackStartPos < 0 ) { blackStartPos = 0};


        //then position the blocking texture at the correct spot and width, and draw
        this.shieldBlackImg.draw((this.consts.screenWidth - this.shieldMeterImg.width) / 2 +
                                 blackStartPos,
                                 this.consts.screenHeight - this.shieldMeterImg.height - 10,
                                 '','', this.shieldMeterImg.width - blackStartPos - 1);
    },

    event_toggleShieldCallback: function(newState) {
        //hard-coding a single ship here. Figure out how to match someday.
        var playerShip = ig.game.getEntitiesByType(EntityShip)[0];
        playerShip.toggleShield(newState);

        if (newState === true) {
            shipPos = playerShip.pos;
            ig.game.spawnEntity(EntityShield,
                                playerShip.pos.x - (64 - playerShip.consts.imageWidth) / 2,
                                playerShip.pos.y - (64 - playerShip.consts.imageHeight) / 2,
                                { myAssociatedShip: playerShip});
        }
        else {
            //also assumes a single shield
            var currentShield = ig.game.getEntitiesByType(EntityShield)[0];
            currentShield.killMe();
        }
    },

    event_fadingShieldCallback: function(newState) {
        var currentShield = ig.game.getEntitiesByType(EntityShield)[0];

        //set this game's shield object to its fading animation, because it's close to gone
        if (newState === true)  {
            currentShield.startFading();
        }
        else {
            currentShield.stopFading();
        }
    }
});

TitleScreen = ig.Game.extend({
    // Load a font
    titleFont: new ig.Font( 'media/titleFont.png' ),

    //Constants for the game level
    consts: {
        screenHeight: MAX_SCREEN_HEIGHT,
        screenWidth: SCREEN_WIDTH,
        zoomFactor: ZOOM_FACTOR,
        spawnOffset: SPAWN_OFFSET
    },

    startButton: new ig.Image('media/buttons/button_green.png'),

    init: function() {

        //Update the "screen height" for other code that references it
        this.consts.screenHeight = Math.min(window.innerHeight, this.consts.screenHeight);

        //start the sound manager
        this.initSounds();

        ig.input.bind(ig.KEY.SPACE, 'begin');
        if (ig.ua.mobile) {
            var buttonDims = {
                x: this.LogicalToPixelX(50) - this.startButton.width / 2,
                y: this.LogicalToPixelY(60),
                width: this.startButton.width,
                height: this.startButton.height
            };
            new ig.TouchButton('begin', buttonDims.x, buttonDims.y, buttonDims.width, buttonDims.height);
        }
    },

    initSounds: function () {
        ig.Sound.use = [ig.Sound.FORMAT.CAF, ig.Sound.FORMAT.OGG, ig.Sound.FORMAT.MP3];
        ig.Sound.channels = 20;
        ig.soundManager.load('media/sounds/explosion.mp3', true);
        ig.soundManager.load('media/sounds/laser.mp3', true);
        ig.soundManager.load('media/sounds/menu_button.mp3', true);
        ig.soundManager.load('media/sounds/shieldsUp.mp3', true);
        ig.soundManager.load('media/sounds/shieldsDown.mp3', true);
        ig.soundManager.load('media/sounds/shipDeath.mp3', true);
    },

    draw: function() {
        this.parent();

        this.titleFont.draw("Asteroid Runner", this.LogicalToPixelX(50),
                       this.LogicalToPixelY(20), ig.Font.ALIGN.CENTER);

        var buttonY = this.LogicalToPixelY(60);
        this.startButton.draw(this.LogicalToPixelX(50) - this.startButton.width / 2,
                              buttonY);
        this.titleFont.draw("PLAY!", this.LogicalToPixelX(50), buttonY,
                       ig.Font.ALIGN.CENTER);
    },

    update: function() {
        if (ig.input.state('begin')) {
            ig.input.unbindAll();
            var buttonSound = ig.soundManager.get('media/sounds/menu_button.mp3');
            buttonSound.play();
            ig.system.setGame(MainGame);
        }
    }

});

// Start the Game
ig.main('#canvas', TitleScreen, 60, SCREEN_WIDTH, TitleScreen.prototype.consts.screenHeight, 1);



});
