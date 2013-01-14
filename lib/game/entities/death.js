ig.module(
	'game.entities.death'
)
.requires(
	'impact.entity'
)
.defines(function() {

EntityDeath = ig.Entity.extend({
	size: {x:48, y: 48},
	collides: ig.Entity.COLLIDES.NONE,
	
	animSheet: new ig.AnimationSheet( 'media/death', 48, 48),
		
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		
		this.addAnim('idle', 0.1, [0,1]);
				
		},
		
	update: function() {
		if (this.anims.idle.loopCount) {
			this.kill();
		}
		
		this.parent();
	}
	});	
});