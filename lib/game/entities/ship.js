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
	name: "ship",
	size: {x:32, y: 36},
	collides: ig.Entity.COLLIDES.ACTIVE,
			
	animSheet: new ig.AnimationSheet( 'media/ship_1', 44, 48),
		
	init: function(x, y, settings) {
		this.parent(x, y, settings);		
		this.addAnim('idle', 0.1, [0,1,2,3,2,1]);
		this.addAnim('bankLeft', 0.1, [4,5,6,7,6,5]);
		this.addAnim('bankRight', 0.1, [8,9,10,11,10,9]);
		this.maxVel.x = 150;
				
	},
		
	update: function() {
		//movement left and right
		if (ig.input.state('left')) {
			this.accel.x = -1000;
		}
		else if (ig.input.state('right')) {
			this.accel.x = 1000;
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
		
		//if the ship is falling off the edge of the screen, 'bounce' off
		if ((this.pos.x <= 0) || (this.pos.x >= 400 - this.size.x)) {
			this.vel.x = - this.vel.x;
			this.accel.x = 0;
		}
		
		//based on the ship's current accel (calculated//updated above), select a bank animation
		if (this.accel.x < 0) {
			this.currentAnim = this.anims.bankLeft;
		}
		else if (this.accel.x > 0 ) {
			this.currentAnim = this.anims.bankRight;
		}
		else {
			this.currentAnim = this.anims.idle;
		}
		
				
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