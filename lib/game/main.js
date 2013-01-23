ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	
	'game.entities.ship',
	'game.entities.asteroid',
	
	'game.levels.levelOne',
	'game.classes.scoreTracker'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/scoreFont.png' ),
	
	//Current score, starts at zero
	score: 0,

	init: function() {
		// Initialize your game here; bind keys etc.
		this.loadLevel( LevelLevelOne );
		
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right');
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down');
		ig.input.bind( ig.KEY.UP_ARROW, 'up');
		ig.input.bind( ig.KEY.SPACE, 'shoot');
		
		initBackgroundMapScrolling();
		
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		//spawn asteroids and walls
		spawnRandomly(EntityAsteroid, '2%');
		spawnRandomly(EntityWall, '0.2%');
		
		scrollBackgroundMap();
		
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		// Draw the current score			
		this.font.draw( this.score, 10, 10, ig.Font.ALIGN.LEFT);
	}
});


function spawnRandomly(ObjectToSpawn, percentChancePerFrame) {
	var xPos = Math.floor((Math.random()*400)+1);  //random location on screen width
	var chanceToSpawn = Math.floor((Math.random()*1000)+1);
	if (chanceToSpawn > (1000 - 10 * parseFloat(percentChancePerFrame))) {
		ig.game.spawnEntity(ObjectToSpawn, xPos, ig.game.screen.y - 192);  //spawn well above the viewport to avoid warping
	}	
}

function initBackgroundMapScrolling() {
	//set up background map so it scrolls
	ig.game.screen.x = 0;
	ig.game.screen.y = 800;
	var myBGMap = ig.game.backgroundMaps[0];
	myBGMap.setScreenPos(ig.game.screen.x, ig.game.screen.y);
	var myStarLayer = ig.game.backgroundMaps[1];
	myStarLayer.setScreenPos(ig.game.screen.x, ig.game.screen.y / myStarLayer.distance);
}

function scrollBackgroundMap() {
	//scroll background map
	ig.game.screen.y -= 1;
	var myBGMap = ig.game.backgroundMaps[0];
	myBGMap.setScreenPos(0, myBGMap.scroll.y - 1);
	var myStarLayer = ig.game.backgroundMaps[1];
	myStarLayer.setScreenPos(0, myStarLayer.scroll.y - 1);
}

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 400, 400, 2);

});
