ig.module(
	'game.entities.wall'
)
.requires(
	'impact.entity'
)
.defines(function() {

EntityWall = ig.Entity.extend({
	size: {x:192, y: 48},
	collides: ig.Entity.COLLIDES.FIXED,
	
	animSheet: new ig.AnimationSheet( 'media/wall',192,48),
		
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		
		this.addAnim('idle', 0.1, [0]);
				
		}
		
	});	
});