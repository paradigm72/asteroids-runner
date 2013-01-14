ig.module(
	'game.entities.ship'
)
.requires(
	'impact.entity',
	'game.entities.laserShot',
	'game.entities.death'
)
.defines(function() {

EntityShip = ig.Entity.extend({
	size: {x:48, y: 48},
	collides: ig.Entity.COLLIDES.ACTIVE,
			
	animSheet: new ig.AnimationSheet( 'media/ship_1', 48, 48),
		
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		
		this.addAnim('idle', 0.1, [0,1,2,3]);
				
	},
		
	update: function() {
		//movement left and right
		if (ig.input.state('left')) {
			this.vel.x = -100;
		}
		else if (ig.input.state('right')) {
			this.vel.x = 100;
		}
		else {
			this.vel.x = 0;
		}
		
		//movement up and down
		if (ig.input.state('up')) {
			this.vel.y = -100;
		}
		else if (ig.input.state('down')) {
			this.vel.y = 100;
		}
		else {
			this.vel.y = 0;
		}		
		
		//shoot
		if (ig.input.pressed('shoot')) {
			ig.game.spawnEntity(EntityLaserShot, this.pos.x, this.pos.y);
			ig.game.spawnEntity(EntityLaserShot, this.pos.x + this.size.x / 2, this.pos.y);
		}
		
		//by default, the ship moves up 1px/frame to "stay still"
		this.pos.y -= 1;
		
		
		this.parent();
	},
	
	
	//if we run into an asteroid, the player dies
	collideWith: function(entity) {
		this.kill();
		ig.game.spawnEntity(EntityDeath, this.pos.x, this.pos.y);
	}	
});	
});