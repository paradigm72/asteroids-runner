ig.module(
    'game.entities.asteroidExplosionParticle'
)
.requires(
    'impact.game'
)
.defines( function() {
    EntityAsteroidExplosionParticle = ig.Entity.extend({
        size: {x: 2, y: 2},
        maxVel: {x:40, y: 75},
        lifeSpanSeconds: 1,
        fadeTimeSeconds: 0.5,
        vel: { x: 12, y: 25},
        collides: ig.Entity.COLLIDES.NONE,
        animSheet: new ig.AnimationSheet('media/asteroid_particles.png', 2, 2),
        numTypes: 8,
        init: function(x, y) {
            this.parent(x, y);
            var startFrameID = Math.round(Math.random()*this.numTypes);
            this.addAnim('idle', 0.2, [startFrameID]);
            this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 2 - 1) * this.vel.y - 50;
            this.lifeTimer = new ig.Timer();
        },
        update: function() {
            if (this.lifeTimer.delta() > this.lifeSpanSeconds) {
                this.kill();
                return;
            }
            this.currentAnim.alpha = this.lifeTimer.delta().map(
                this.lifeSpanSeconds - this.fadeTimeSeconds, this.lifeSpanSeconds, 1, 0);
            this.parent();
        }
    });
});