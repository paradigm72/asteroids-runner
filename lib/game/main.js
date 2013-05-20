ig.module(
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

    'game.entityFactory',

	'game.entities.ship',
	'game.entities.asteroid',
	
    'plugins.logicalCoords',
    'plugins.entity_spawnPosCheck',
    'plugins.empika.debug_display',
    'plugins.touch-button',

	
    'game.levels.levelOne'
)
.defines(function(){

	
//pre-constructor constants
var SCREEN_HEIGHT = 480;  //no longer really a const - adjusted for device size
var SCREEN_WIDTH = 320;
var ZOOM_FACTOR = 1;
var SPAWN_OFFSET = -192;

MyGame = ig.Game.extend({
	
	
	// Load a font
	font: new ig.Font( 'media/scoreFont.png' ),
	
	//Current score, starts at zero
	score: 0,
	
	//Game state, -1 if player is dead, 0 otherwise
	gameStateEnum: {
        'active': 0,
        'playerDead_ready': -1,
        'playerDead_lockedOut': -2,
        'paused': 1
    },

    //keep track of how long the level has been running
    gameSpeedTimer: new ig.Timer(),
	
	//Constants for the game level
	consts: {
		screenHeight: SCREEN_HEIGHT,
		screenWidth: SCREEN_WIDTH,
		zoomFactor: ZOOM_FACTOR,
        spawnOffset: SPAWN_OFFSET
	},



    init: function() {

        //Update the "screen height" for other code that references it
        this.consts.screenHeight = window.innerHeight;

		this.loadLevel( LevelLevelOne );

        //Initial value for the game state: active, playing.
        this.gameState = this.gameStateEnum.active;

        //Helper object to handle spawning new asteroids/walls for us
        this.entityFactory = new EntityFactory;


        ig.Sound.use = [ig.Sound.FORMAT.CAF, ig.Sound.FORMAT.OGG, ig.Sound.FORMAT.MP3];
        ig.Sound.channels = 20;
        ig.soundManager.load('media/explosion.mp3', true);
        ig.soundManager.load('media/laser.mp3', true);

        this.initInputBindings();
        this.initBackgroundMapScrolling();

        //frames per second
        this.debugDisplay = new DebugDisplay(this.font);

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
		
		this.scrollBackgroundMap();
                        
        //if the player is dead and the wait timer has passed, allow reloading
        if (this.gameState === this.gameStateEnum.playerDead_ready) {
            if (ig.input.pressed('shoot')) {
                this.resetGame();
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
        this.loadLevel( LevelLevelOne);
        this.gameSpeedTimer.reset();
    },
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		// Draw the current score			
		this.font.draw( this.score, 10, 10, ig.Font.ALIGN.LEFT);

        //Draw debug info
        this.debugDisplay.draw([], true);
		
		// If player is dead, show Reload text
		if ((this.gameState === this.gameStateEnum.playerDead_lockedOut) ||
            (this.gameState === this.gameStateEnum.playerDead_ready)) {
			this.font.draw( "You have died",
                                       this.consts.screenWidth * 0.5,
                                       150,
                                       ig.Font.ALIGN.CENTER);
        }
        if (this.gameState === this.gameStateEnum.playerDead_ready) {
            this.font.draw( "Tap to try again",
                this.consts.screenWidth * 0.5,
                190,
                ig.Font.ALIGN.CENTER);
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
	}
});

// Start the Game
ig.main( '#canvas', MyGame, 60, SCREEN_WIDTH, window.innerHeight, 1);



});
