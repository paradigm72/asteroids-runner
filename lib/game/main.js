ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	
	'game.entities.ship',
	'game.entities.asteroid',
	
	'game.levels.levelOne'
)
.defines(function(){

	
//pre-constructor constants
var SCREEN_HEIGHT = 548;
var SCREEN_WIDTH = 320;
var ZOOM_FACTOR = 1;

MyGame = ig.Game.extend({
	
	
	// Load a font
	font: new ig.Font( 'media/scoreFont.png' ),
	
	//Current score, starts at zero
	score: 0,
	
	//Game state, -1 if player is dead
	gameState: 0,
	
	//Constants for the game level
	consts: {
		screenHeight: SCREEN_HEIGHT,
		screenWidth: SCREEN_WIDTH,
		zoomFactor: ZOOM_FACTOR
	},

	init: function() {
		// Initialize your game here; bind keys etc.
		this.loadLevel( LevelLevelOne );
		ig.Sound.channels = 20;
		ig.soundManager.load('media/explosion.mp3', true);
		ig.soundManager.load('media/laser.mp3', true);
		
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right');
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down');
		ig.input.bind( ig.KEY.UP_ARROW, 'up');
		ig.input.bind( ig.KEY.SPACE, 'shoot');
		
		this.initBackgroundMapScrolling();
		
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		//spawn asteroids and walls
		this.spawnRandomObstacles(EntityAsteroid, '2%');
		this.spawnRandomObstacles(EntityWall, '0.2%');
		
		this.scrollBackgroundMap();
		
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		// Draw the current score			
		this.font.draw( this.score, 10, 10, ig.Font.ALIGN.LEFT);
		
		// If player is dead, show Reload text
		if (this.gameState == -1) {
			this.font.draw( "You have died", 200, 150, ig.Font.ALIGN.CENTER);
			this.font.draw( "Reload to try again", 200, 190, ig.Font.ALIGN.CENTER);
		}
	},
	
	spawnRandomObstacles: function(ObjectToSpawn, percentChancePerFrame) {
		var xPos = Math.floor((Math.random()*ig.game.consts.screenWidth)+1);  //random location on screen width
		var chanceToSpawn = Math.floor((Math.random()*1000)+1);
		if (chanceToSpawn > (1000 - 10 * parseFloat(percentChancePerFrame))) {
			ig.game.spawnEntity(ObjectToSpawn, xPos, ig.game.screen.y - 192);
		}	
	},
	
	initBackgroundMapScrolling: function () {
		//set up background map so it scrolls
		ig.game.screen.x = 0;
		ig.game.screen.y = 800;
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
ig.main( '#canvas', MyGame, 60, SCREEN_WIDTH, SCREEN_HEIGHT, ZOOM_FACTOR);

});
