ig.module(
	'game.entities.laserShot'
)
.requires(
	'impact.entity'
)
.defines(function() {

EntityLaserShot = ig.Entity.extend({
	size: {x:10, y: 38},
	collides: ig.Entity.COLLIDES.NONE,
	maxVel: {x: 1000, y: 1000},    //much faster than most objects
	
	//player type = A
	type: ig.Entity.TYPE.A,
	//asteroid type = B
	checkAgainst: ig.Entity.TYPE.B,
	
	animSheet: new ig.AnimationSheet( 'media/projectile_green',10,38),
		
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		
		this.addAnim('idle', 0.1, [0]);
		
		this.vel.y = -500;
				
		},
		
	//if this laser shot hits anything, it disappears
	check: function(entityHit) {
		if (entityHit.name == "wall") {
			this.kill();			
		}		
	}
	});	
});