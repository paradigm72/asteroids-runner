ig.module(
    'game.entities.shield'
)
.requires(
    'impact.entity'
)
.defines(function() {

EntityShield = ig.Entity.extend({
    size: {x: 64, y: 64},
    animSheet: new ig.AnimationSheet('media/shield.png', 64, 64),
    myShipRef: null,

    init: function(x, y, settings) {
        myShipRef = settings.myAssociatedShip;

        this.parent(x, y, settings);
        this.addAnim('idle', 0.1, [0]);

        this.currentAnim = this.anims.idle;
    },

    update: function() {
        this.parent();
        this.pos.x = myShipRef.pos.x - 8;
        this.pos.y = myShipRef.pos.y - 8;
    }
});
});