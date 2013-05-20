ig.module(
	'game.entities.wall'
)
.requires(
	'impact.entity'
)
.defines(function() {

EntityWall = ig.Entity.extend({
	size: {x:132, y: 36},
    offset: {x: 6, y: 6},
	collides: ig.Entity.COLLIDES.FIXED,

	
	animSheet: new ig.AnimationSheet( 'media/wall.png',144,48),
	
	//walls will stop laser shots, but not get destroyed by them
	//asteroid type = B
	type: ig.Entity.TYPE.B,
	//player type = A
	checkAgainst: ig.Entity.TYPE.A,
		
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		
		this.addAnim('idle', 0.1, [0]);
				
    },

    update: function() {
        this.parent();

        //if this has fallen off the screen, clean it up
        if (this.pos.y > ig.game.screen.y + ig.game.consts.screenHeight) {
            this.kill();
        }
    },

    //if a laser shot runs into this, kill the laser shot
    check: function(entityHit) {
        if (entityHit instanceof EntityLaserShot) {
            entityHit.kill();
        }
    }

	});			
});