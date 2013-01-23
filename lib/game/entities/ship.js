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
		this.maxVel.x = 150;
				
	},
		
	update: function() {
		//movement left and right
		if (ig.input.state('left')) {
			this.accel.x = -2000;
		}
		else if (ig.input.state('right')) {
			this.accel.x = 2000;
		}
		else {
			this.accel.x = 0;
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
			ig.game.spawnEntity(EntityLaserShot, this.pos.x + this.size.x / 1.5, this.pos.y);
		}
		
		//by default, the ship moves up 1px/frame to "stay still"
		this.pos.y -= 1;
		
		//increase score by 1 each frame if the ship is still alive
		ig.game.score += 1;
		
		
		this.parent();
	},
	
	
	//if we run into an object, the player dies
	collideWith: function(entity) {
		this.kill();
		ig.game.spawnEntity(EntityDeath, this.pos.x, this.pos.y);
	}	
});	
});