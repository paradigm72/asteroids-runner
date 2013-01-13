ig.module(
	'game.entities.laserShot'
)
.requires(
	'impact.entity'
)
.defines(function() {

EntityLaserShot = ig.Entity.extend({
	size: {x:10, y: 38},
	collides: ig.Entity.COLLIDES.ACTIVE,
	
	animSheet: new ig.AnimationSheet( 'media/projectile_green',10,38),
		
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		
		this.addAnim('idle', 0.1, [0]);
		
		this.vel.y = -100;
				
		}
	});	
});