ig.module(
	'game.entities.shipExplosion'
)
.requires(
	'impact.game',
    'game.entities.shipExplosionParticle'
)
.defines(function() {

EntityShipExplosion = ig.Entity.extend({
	particles: 30,
    lifeSpanSeconds: 1,
    init: function(x, y, settings) {
		this.parent(x, y, settings);
		
		for (var i=0; i < this.particles; i++) {
            ig.game.spawnEntity(EntityShipExplosionParticle, x, y);
        }
        this.lifeTimer = new ig.Timer();

		var deathSound = ig.soundManager.get('media/sounds/shipDeath.mp3');
        deathSound.play();

		},
		
	update: function() {
        if (this.lifeTimer.delta() > this.lifeSpanSeconds) {
            this.kill();
        }
	}
	});	
});