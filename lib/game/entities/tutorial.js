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
    
    animSheet: new ig.AnimationSheet( 'media/tutorial.png', 400, 64 ),
     
    init: function( x, y, settings ) {
        this.parent( x, y, settings );
        this.addAnim( 'idle', 1, [0] );
        this.vel.y = -45;   //slowly drift off the screen
    }


});
});