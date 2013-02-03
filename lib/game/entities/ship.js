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
	
	consts: {
		sideBuffer: 4,
		imageWidth: 44,
		imageHeight: 48,
		laserShotBuffer: 4
	},
			
	//scoping doesn't allow re-use of the constants here
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
			this.vel.x = -150;
		}
		else if (ig.input.state('right')) {
			this.vel.x = 150;
		}
		else {
			if (Math.abs(this.vel.x) <= 25) {
				this.vel.x = 0;
			}			
			else {
				this.vel.x = 0.90 * this.vel.x;
			}
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
			ig.game.spawnEntity(EntityLaserShot, this.pos.x + this.consts.laserShotBuffer, this.pos.y);
			ig.game.spawnEntity(EntityLaserShot, this.pos.x + this.size.x - this.consts.laserShotBuffer, this.pos.y);
		}
		
		//by default, the ship moves up 1px/frame to "stay still"
		this.pos.y -= 1;
		
		//if the ship is falling off the edge of the screen, hold it on the edge of the screen
		if (this.pos.x <= 0) {
			this.pos.x = this.consts.sideBuffer;
			this.vel.x = 0;
		}
		else if (this.pos.x >= 400 - this.consts.imageWidth) {
			this.pos.x = 400 - this.consts.imageWidth - this.consts.sideBuffer;
			this.vel.x = 0;
		}
		
		//based on the ship's current accel (calculated//updated above), select a bank animation
		if (this.vel.x < 0) {
			this.currentAnim = this.anims.bankLeft;
		}
		else if (this.vel.x > 0 ) {
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
		ig.game.gameState = -1;
	}	
});	
});