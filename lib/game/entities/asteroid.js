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
	
	animSheet: new ig.AnimationSheet( 'media/asteroid',48,48),
		
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.vel.y = 50 + Math.floor((Math.random()*20)+1);;
		this.addAnim('idle', 0.1, [0]);
				
	},
	
	update: function() {
		//slowly normalize back to starting velocity
		this.vel.y += 0.01 * (60 - this.vel.y);
		this.parent();
	},
	
	
	//if this asteroid gets hit by a laser shot, it's destroyed	
	check: function(hitEntity) {
		this.kill();
		//play death animation
		ig.game.spawnEntity(EntityDeath, this.pos.x, this.pos.y);
		
		//add to the player's score
		ig.game.score += 100;
	}
	});	
});