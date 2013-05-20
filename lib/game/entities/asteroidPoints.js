ig.module(
        'game.entities.asteroidPoints'
)
.requires(
    'impact.entity'
)
.defines(function() {

    EntityAsteroidPoints = ig.Entity.extend({
        size: {x:32, y: 16},
        collides: ig.Entity.COLLIDES.NONE,

        animSheet: new ig.AnimationSheet( 'media/asteroid_points.png', 32, 16),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 0.1, [0,1,2,3,4,5,6,7,8,9,10,11], true);
            var deathSound = ig.soundManager.get('media/sounds/explosion.mp3');
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