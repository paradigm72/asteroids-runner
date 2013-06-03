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
	
	animSheet: new ig.AnimationSheet( 'media/projectile_green.png',10,38),
		
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		
		this.addAnim('idle', 0.1, [0]);		
		this.vel.y = -500;


        var laserSound = ig.soundManager.get('media/sounds/laser.mp3');
        laserSound.play();

	},

    //called by other entities during a collision
    killMe: function() {
        this.kill();
    },
		
	//laser shots disappear on hitting anything, but that's handled
    //in the check methods of the entities they hit
	check: function(entityHit) {
    }

	});	
});