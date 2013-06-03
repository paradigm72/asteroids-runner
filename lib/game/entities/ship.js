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
	size: {x:32, y: 36},
    offset: {x:6, y: 6},
	collides: ig.Entity.COLLIDES.ACTIVE,
    //player type = A
    type: ig.Entity.TYPE.A,
    //asteroid type = B
    checkAgainst: ig.Entity.TYPE.B,
	
	consts: {
		sideBuffer: 4,
		imageWidth: 44,
		imageHeight: 48,
		laserShotBuffer: 4
	},
		
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		
		this.animSheet = new ig.AnimationSheet( 'media/ship_1.png', this.consts.imageWidth, this.consts.imageHeight);		
		this.addAnim('idle', 0.1, [0,1,2,3,2,1]);
		this.addAnim('bankLeft', 0.1, [4,5,6,7,6,5]);
		this.addAnim('bankRight', 0.1, [8,9,10,11,10,9]);
		
		this.maxVel.x = 200;
                
        this.setLogicalX(50, true);
        this.setLogicalY(75);
	},
		
	update: function() {
		
		if (ig.ua.mobile) {
            this.processAccelerometerInput();
        }
        else {
            this.processKeyboardInput();
        }

		
		//by default, the ship moves up 1px/frame to "stay still"
		this.pos.y -= 1;
		
		this.handleScreenEdges();
		
		//based on the ship's current velocity (calculated//updated above), select a bank animation
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
	
	
	//if we collid with an object (wall), the player dies
	collideWith: function(entityHit) {
        if(entityHit instanceof EntityWall) {
            this.killMe();
        }

	},

    //if we run over an asteroid (asteroids are non-colliding so they can pass over walls),
    //the player dies as well
    check: function(entityHit) {
        if (entityHit instanceof EntityAsteroid) {
            this.killMe();
            entityHit.killMe();
        }
    },

    killMe: function() {
        this.kill();
        ig.game.spawnEntity(EntityDeath, this.pos.x, this.pos.y);
        ig.game.gameState = ig.game.gameStateEnum.playerDead_lockedOut;
        ig.game.gameSpeedTimer.pause();
        ig.game.lockoutTimer = new ig.Timer();
    },
	
	processKeyboardInput: function() {
		//movement left and right
		if (ig.input.state('left')) {
			//max velocity is 150, so we reach that very quickly
			this.accel.x = -750;    
		}
		else if (ig.input.state('right')) {
			this.accel.x = 750;
		}
		else {
			//immediately stop accelerating
			this.accel.x = 0;
			
			//ramp down to 0 velocity quickly (not much coasting)
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
			if (Math.abs(this.vel.y) <= 25) {
				this.vel.y = 0;
			}			
			else {
				this.vel.y = 0.90 * this.vel.y;
			}
		}
		
		//shoot
		if (ig.input.pressed('shoot')) {
			ig.game.spawnEntity(EntityLaserShot, this.pos.x + this.consts.laserShotBuffer, this.pos.y);
			ig.game.spawnEntity(EntityLaserShot, this.pos.x + this.size.x - this.consts.laserShotBuffer, this.pos.y);
		    ig.game.gameStats.shotsFired++;
        }
	},

    processAccelerometerInput: function() {
        //movement left and right
        if (ig.input.accel.x < -0.1) {
            //max velocity is 150, so we reach that very quickly
            this.accel.x = -500;
        }
        else if (ig.input.accel.x > 0.1) {
            this.accel.x = 500;
        }
        else {
            //immediately stop accelerating
            this.accel.x = 0;

            //ramp down to 0 velocity quickly (not much coasting)
            if (Math.abs(this.vel.x) <= 25) {
                this.vel.x = 0;
            }
            else {
                this.vel.x = 0.90 * this.vel.x;
            }
        }

        //movement up and down
        /*if (ig.input.accel.y > 0.2) {
            this.vel.y = -50;
        }
        else if (ig.input.accel.y < -0.2) {
            this.vel.y = 50;
        }
        else {
            if (Math.abs(this.vel.y) <= 25) {
                this.vel.y = 0;
            }
            else {
                this.vel.y = 0.90 * this.vel.y;
            }
        }*/

        //shoot
        if (ig.input.pressed('shoot')) {
            ig.game.spawnEntity(EntityLaserShot, this.pos.x + this.consts.laserShotBuffer, this.pos.y);
            ig.game.spawnEntity(EntityLaserShot, this.pos.x + this.size.x - this.consts.laserShotBuffer, this.pos.y);
            ig.game.gameStats.shotsFired++;
        }
    },
	
	handleScreenEdges: function() {
		//if the ship is falling off the edge of the screen, hold it on the edge of the screen
		if (this.pos.x <= 0) {
			this.pos.x = this.consts.sideBuffer;
			this.vel.x = 0;
		}
		else if (this.pos.x >= ig.game.consts.screenWidth - this.consts.imageWidth) {
			this.pos.x = ig.game.consts.screenWidth - this.consts.imageWidth - this.consts.sideBuffer;
			this.vel.x = 0;
		}
		
		if (this.pos.y <= ig.game.screen.y) {
			this.pos.y = ig.game.screen.y + this.consts.sideBuffer;
			this.vel.y = 0;
		}
		else if (this.pos.y >= ig.game.screen.y + ig.game.consts.screenHeight - this.consts.imageHeight) {
			this.pos.y = ig.game.screen.y +
				     ig.game.consts.screenHeight -
				     this.consts.imageHeight -
				     this.consts.sideBuffer;
			this.vel.y = 0;
		}
	}
	
	
});



});