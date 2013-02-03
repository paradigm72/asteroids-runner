ig.module(
    'game.entities.tutorial'
)
.requires(
    'impact.entity'
)
.defines(function(){
    
EntityTutorial = ig.Entity.extend({
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER,
    
    size: {x: 400, y: 75},
    
    tooltipCounter: null,
    
    animSheet: new ig.AnimationSheet( 'media/tutorial.png', 400, 64 ),
     
    init: function( x, y, settings ) {
        this.parent( x, y, settings );
        this.addAnim( 'idle', 1, [0] ); 
        this.tooltipCounter = 200;
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