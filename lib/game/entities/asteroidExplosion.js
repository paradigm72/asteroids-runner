ig.module(
    'game.entities.asteroidExplosion'
)
.requires(
    'impact.game',
    'game.entities.asteroidExplosionParticle'
)
.defines( function() {
    EntityAsteroidExplosion = ig.Entity.extend({
        particles: 20,
        lifeSpanSeconds: 1,
        init: function(x, y) {
            this.parent(x, y);
            for(var i=0; i < this.particles; i++) {
                ig.game.spawnEntity(EntityAsteroidExplosionParticle, x, y);
            }
            this.lifeTimer = new ig.Timer();
        },
        update: function() {
            if(this.lifeTimer.delta() > this.lifeSpanSeconds) {
                this.kill();
            }
        }
    })


});

