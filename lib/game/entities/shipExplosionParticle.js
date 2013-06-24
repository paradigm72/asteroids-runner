ig.module(
    'game.entities.shipExplosionParticle'
)
.requires(
        'impact.game'
)
.defines( function() {

EntityShipExplosionParticle = ig.Entity.extend({
    size: { x: 2, y: 2},
    maxVel: {x: 50, y:50},
    lifeSpanSeconds: 1,
    fadeTimeSeconds: 0.5,
    vel: {x: 20, y:20},
    collide: ig.Entity.COLLIDES.NONE,
    animSheet: new ig.AnimationSheet('media/ship/ship_particles.png', 2, 2),
    numTypes: 8,
    init: function(x, y) {
        this.parent(x, y);
        var startFrameID = Math.round(Math.random()*this.numTypes);
        this.addAnim('idle', 0.2, [startFrameID]);
        this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
        this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
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