ig.module(
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

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
var SCREEN_HEIGHT = 480;
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
	
	//Constants for the game level
	consts: {
		screenHeight: SCREEN_HEIGHT,
		screenWidth: SCREEN_WIDTH,
		zoomFactor: ZOOM_FACTOR,
        spawnOffset: SPAWN_OFFSET
	},



    init: function() {
		// Initialize your game here; bind keys etc.
		this.loadLevel( LevelLevelOne );

        this.gameState = this.gameStateEnum.active;


        ig.Sound.use = [ig.Sound.FORMAT.CAF, ig.Sound.FORMAT.OGG, ig.Sound.FORMAT.MP3];
        ig.Sound.channels = 20;
        ig.soundManager.load('media/explosion.mp3', true);
        ig.soundManager.load('media/laser.mp3', true);

        this.initInputBindings();
        this.initBackgroundMapScrolling();

        //DEBUG
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
		this.spawnRandomObstacles(EntityAsteroid, '10%');
		this.spawnRandomObstacles(EntityWall, '5%');
		
		this.scrollBackgroundMap();
                        
        //if the player is dead, allow reloading
        if (this.gameState === this.gameStateEnum.playerDead_ready) {
            if (ig.input.pressed('shoot')) {
                this.gameState = 0;
                this.score = 0;
                this.loadLevel( LevelLevelOne);
            }
        }
        else if (this.gameState === this.gameStateEnum.playerDead_lockedOut) {
            if (this.lockoutTimer.delta() >= 1) {
                this.gameState = this.gameStateEnum.playerDead_ready;
                delete this.lockoutTimer;
            }
        }
		
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

    spawnRandomObstacles: function(ObjectToSpawn, percentChancePerFrame) {
        //random location on screen width, without falling off the right edge
        var xPos = Math.floor((Math.random() *
                              (ig.game.consts.screenWidth - ObjectToSpawn.prototype.size.x)+1));
		var chanceToSpawn = Math.floor((Math.random()*1000)+1);
		if (chanceToSpawn > (1000 - 10 * parseFloat(percentChancePerFrame))) {
            if (this.canSpawnNew(ObjectToSpawn)) {
                console.log("Spawned new " + ObjectToSpawn.prototype.name + " at [" + xPos + "]");
                ig.game.spawnEntity(ObjectToSpawn, xPos, ig.game.screen.y + this.consts.spawnOffset);
            }
		}	
	},

    canSpawnNew: function(ObjectToSpawn) {
        var walls = ig.game.getEntitiesByType(EntityWall);
        var asteroids = ig.game.getEntitiesByType(EntityAsteroid);
        var canSpawn = { 'asteroid': true, 'wall': true};

        //check for walls in the top row
        for (var i = 0; i < walls.length; i++) {
            if (walls[i].isOnTopRow()) {
                //found something in the top 'row', so quit with false
                canSpawn.asteroid = false;
                canSpawn.wall = false;
                console.log("Try to spawn " + ObjectToSpawn.prototype.name +
                            " at screen height: " + ig.game.screen.y +
                            ", found wall[" + i + "] at height" + walls[i].pos.y);
                return canSpawn[ObjectToSpawn.prototype.name];
            }
        }

        //check for asteroids in the top row
        for (var i = 0; i < asteroids.length; i++) {
            if (asteroids[i].isOnTopRow()) {
                //found something in the top 'row', so quit with false
                canSpawn.asteroid = false;
                canSpawn.wall = false;
                console.log("Try to spawn " + ObjectToSpawn.prototype.name +
                            " at screen height: " + ig.game.screen.y +
                            ", found asteroid[" + i + "] at height" + asteroids[i].pos.y);
                return canSpawn[ObjectToSpawn.prototype.name];
            }
        }

        //check for walls anywhere in the top 3 rows (avoid an impassable level)
        for (var i = 0; i < walls.length; i++) {
            if (walls[i].isNearTopRow()) {
                //found something in the top 'row', so quit with false
                canSpawn.asteroid = true;  //ok to spawn asteroids in this case
                canSpawn.wall = false;
                console.log("Try to spawn " + ObjectToSpawn.prototype.name +
                            " at screen height: " + ig.game.screen.y +
                            ", found wall[" + i + "]at height" + walls[i].pos.y);
                return canSpawn[ObjectToSpawn.prototype.name];
            }
        }

        //if we didn't find anything in the top row, or any walls in the top 3 rows, ok to spawn
        canSpawn.asteroid = true;
        canSpawn.wall = true;
        return canSpawn[ObjectToSpawn.prototype.name];
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
if (ig.ua.pixelRatio===2) {
    ig.main( '#canvas', MyGame, 60, SCREEN_WIDTH, SCREEN_HEIGHT, ZOOM_FACTOR);
}
else {
    ig.main( '#canvas', MyGame, 60, SCREEN_WIDTH, SCREEN_HEIGHT, 1);
}


});
