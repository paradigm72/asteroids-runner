ig.module(
	'game.entities.asteroid'
)
.requires(
	'impact.entity',
	'game.entities.asteroidPoints',
    'game.entities.asteroidExplosion'

)
.defines(function() {

EntityAsteroid = ig.Entity.extend({
    size: {x:36, y: 36},
    offset: {x: 6, y: 8},    //centering dependent on the exact graphic, update if needed
	collides: ig.Entity.COLLIDES.NONE,

	//asteroid type = B
	type: ig.Entity.TYPE.B,
	//player type = A
	checkAgainst: ig.Entity.TYPE.A,
	
	animSheet: new ig.AnimationSheet( 'media/asteroid.png',48,48),
		
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.vel.y = 50 +
                     ig.game.gameSpeedTimer.delta();
		
		//random orientation between 0 and 3
		var orientation = Math.floor(Math.random()*3);
		this.addAnim('idle', 0.1, [orientation]);
				
	},
	
	update: function() {
		//slowly normalize back to starting velocity
		//this.vel.y += 0.01 * (60 - this.vel.y);
		this.parent();

        //if this has fallen off the screen, clean it up
        if (this.pos.y > ig.game.screen.y + ig.game.consts.screenHeight) {
            this.kill();
        }
	},
	
	
	//if this asteroid gets hit by a laser shot, it's destroyed	
	check: function(entityHit) {
		if (entityHit instanceof EntityLaserShot) {
            this.kill();
            entityHit.kill();
            //play death animation
            ig.game.spawnEntity(EntityAsteroidPoints, this.pos.x, this.pos.y);
            ig.game.spawnEntity(EntityAsteroidExplosion, this.pos.x + this.size.x / 2,
                                                         this.pos.y + this.size.y / 2);

            //add to the player's score
            ig.game.score += 100;
            ig.game.gameStats.asteroidsDestroyed++;
        }
	}
	});	
});