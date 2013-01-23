ig.module(
    'game.classes.scoreTracker'
)
.requires(
    'impact.game'
)
.defines(function(){

ScoreTracker = ig.Class.extend({
    currentScore: 0,
    
    init: function() {
        //pass
    },
    
    addAsteroidKillPoints: function() {
        currentScore += 100;
    },
    
    addTimerPoints: function() {
        currentScore += 1;
    }
    
});

});