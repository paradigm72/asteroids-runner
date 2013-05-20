ig.module(
    'game.entities.tutorial'
)
.requires(
    'impact.entity',
    'plugins.logicalCoords'
)
.defines(function(){
    
EntityTutorial = ig.Entity.extend({
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER,
    vel: { x: 0, y: 50},
    maxVel: {x: 0, y:200},
    
    size: {x: 300, y: 48},
    
    tooltipCounter: new ig.Timer(),
    
    animSheet: new ig.AnimationSheet( 'media/tutorial.png', 300, 48 ),
     
    init: function( x, y, settings ) {
        this.parent( x, y, settings );
        this.addAnim( 'idle', 1, [0] );
        
        this.setLogicalX(50, true);
        this.setLogicalY(88);

        this.tutorialFont = new ig.Font('media/tutorialFont.png');
    },

    draw: function() {
        this.parent();
        this.tutorialFont.draw("SHOOT:", this.pos.x, this.pos.y, ig.Font.ALIGN.LEFT);
        this.tutorialFont.draw("DODGE:", this.pos.x + 120, this.pos.y, ig.Font.ALIGN.LEFT);
    },
    
    update: function() {
	    this.parent();
	    
	    if (this.tooltipCounter.delta() > 3) {
		    delete this.tooltipCounter;
            this.vel.y = 200;
	    }
    }


});
});