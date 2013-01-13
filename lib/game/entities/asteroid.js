ig.module(
	'game.entities.asteroid'
)
.requires(
	'impact.entity'
)
.defines(function() {

EntityAsteroid = ig.Entity.extend({
	size: {x:48, y: 48},
	collides: ig.Entity.COLLIDES.ACTIVE,
	
	animSheet: new ig.AnimationSheet( 'media/asteroid',48,48),
		
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		
		this.addAnim('idle', 0.1, [0]);
				
		}
	});	
});