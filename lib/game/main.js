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

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	
	init: function() {
		// Initialize your game here; bind keys etc.
		this.loadLevel( LevelLevelOne );
		
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right');
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down');
		ig.input.bind( ig.KEY.UP_ARROW, 'up');
		ig.input.bind( ig.KEY.SPACE, 'shoot');
		
		
		//set up background map so it scrolls
		ig.game.screen.x = 0;
		ig.game.screen.y = 800;
		var myBGMap = ig.game.backgroundMaps[0];
		myBGMap.setScreenPos(ig.game.screen.x, ig.game.screen.y);
		var myStarLayer = ig.game.backgroundMaps[1];
		myStarLayer.setScreenPos(ig.game.screen.x, ig.game.screen.y / myStarLayer.distance);
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		//spawn asteroids and walls
		spawnRandomly(EntityAsteroid, '2%');
		spawnRandomly(EntityWall, '0.2%');
		
		//scroll background map
		ig.game.screen.y -= 1;
		var myBGMap = ig.game.backgroundMaps[0];
		myBGMap.setScreenPos(0, myBGMap.scroll.y - 1);
		var myStarLayer = ig.game.backgroundMaps[1];
		myStarLayer.setScreenPos(0, myStarLayer.scroll.y - 1);
		
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		
		// Add your own drawing code here
		var x = ig.system.width/2,
			y = ig.system.height/2;
					
		//this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
	}
});


function spawnRandomly(ObjectToSpawn, percentChancePerFrame) {
	var xPos = Math.floor((Math.random()*400)+1);  //random location on screen width
	var chanceToSpawn = Math.floor((Math.random()*1000)+1);
	if (chanceToSpawn > (1000 - 10 * parseFloat(percentChancePerFrame))) {
		ig.game.spawnEntity(ObjectToSpawn, xPos, ig.game.screen.y - 192);  //spawn well above the viewport to avoid warping
	}	
}


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 400, 400, 2);

});
