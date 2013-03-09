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
    
    size: {x: 300, y: 48},
    
    tooltipCounter: null,
    
    animSheet: new ig.AnimationSheet( 'media/tutorial.png', 300, 48 ),
     
    init: function( x, y, settings ) {
        this.parent( x, y, settings );
        this.addAnim( 'idle', 1, [0] ); 
        this.tooltipCounter = 200;
        
        this.setLogicalX(50, true);
        this.setLogicalY(88);
    },
    
    update: function() {
	    this.parent();
	    
	    if (this.tooltipCounter >= 0) {
		this.tooltipCounter -= 1;
		this.vel.y = -50;
	    }
	    else {
		this.vel.y = -10;  //slowly drift off the screen
	    }
    }


});
});