ig.module(
    'game.entities.shield'
)
.requires(
    'impact.entity'
)
.defines(function() {

EntityShield = ig.Entity.extend({
    size: {x: 64, y: 64},
    animSheet: new ig.AnimationSheet('media/shield/shield.png', 64, 64),
    myShipRef: null,

    init: function(x, y, settings) {
        myShipRef = settings.myAssociatedShip;

        this.parent(x, y, settings);
        this.addAnim('idle', 0.1, [0]);
        this.addAnim('fading', 0.2, [0,1,0,1,0,1,0,1,0,1]);

        this.currentAnim = this.anims.idle;

        var shieldsUpSound = ig.soundManager.get('media/sounds/shieldsUp.mp3');
        shieldsUpSound.play();
    },

    startFading: function() {
        this.currentAnim = this.anims.fading;
    },

    stopFading: function() {
        this.currentAnim = this.anims.idle;
    },

    killMe: function() {
        var shieldsDownSound = ig.soundManager.get('media/sounds/shieldsDown.mp3');
        shieldsDownSound.play();
        this.kill();
    },

    update: function() {
        this.parent();
        this.pos.x = myShipRef.pos.x -
                     (this.size.x - myShipRef.consts.imageWidth) / 2 -
                     myShipRef.offset.x;
        this.pos.y = myShipRef.pos.y -
                     (this.size.y - myShipRef.consts.imageHeight) / 2 -
                     myShipRef.offset.y;
    }
});
});