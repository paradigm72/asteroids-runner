ig.module(
	'game.entities.death'
)
.requires(
	'impact.entity'
)
.defines(function() {

EntityDeath = ig.Entity.extend({
	name: "death",
	size: {x:32, y: 32},
	collides: ig.Entity.COLLIDES.NONE,
	
	animSheet: new ig.AnimationSheet( 'media/death', 32, 32),
		
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		
		this.addAnim('idle', 0.1, [0,1,2,3]);
		var deathSound = ig.soundManager.get('media/explosion.mp3');
		deathSound.play();
				
		},
		
	update: function() {
		if (this.anims.idle.loopCount) {
			this.kill();
		}
		
		this.parent();
	}
	});	
});