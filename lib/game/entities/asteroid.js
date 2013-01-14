ig.module(
	'game.entities.asteroid'
)
.requires(
	'impact.entity',
	'game.entities.death'
)
.defines(function() {

EntityAsteroid = ig.Entity.extend({
	size: {x:48, y: 48},
	collides: ig.Entity.COLLIDES.ACTIVE,
	
	//asteroid type = B
	type: ig.Entity.TYPE.B,
	//player type = A
	checkAgainst: ig.Entity.TYPE.A,
	
	animSheet: new ig.AnimationSheet( 'media/tn_asteroid_2',48,48),
		
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		
		this.addAnim('idle', 0.1, [0]);
				
	},
	
	update: function() {
		this.vel.y = 50 + Math.floor((Math.random()*50)+1);;
		this.parent();
	},
	
	
	//if this asteroid gets hit by a laser shot, it's destroyed	
	check: function(EntityLaserShot) {
		this.kill();
		ig.game.spawnEntity(EntityDeath, this.pos.x, this.pos.y);
	}
	});	
});