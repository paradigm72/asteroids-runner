ig.module(
    'game.scoreStorage'
)
.requires(
    'impact.game'
)
.defines(function() {
    ScoreStorage = ig.Class.extend({
        scoreArray: [],

        init: function() {
            for (var i = 0; i < localStorage['scoreCount']; i = i + 1) {
                this.scoreArray[i] = localStorage['score_'+i];
            }
        },

        saveScore: function(thisScore) {
            var nextScoreIndex;
            if (localStorage['scoreCount'] != '') {
                nextScoreIndex = parseInt(localStorage['scoreCount']) + 1;
            }
            else {
                nextScoreIndex = 1;
            }
            console.log("nextScoreIndex="+nextScoreIndex);
            localStorage.setItem("score_" + nextScoreIndex.toString(), thisScore);
            console.log("thisScore="+thisScore);
            localStorage.setItem("scoreCount", nextScoreIndex);
            console.log("score_"+nextScoreIndex+"="+localStorage["score_"+nextScoreIndex]);
            console.log("scoreCount="+localStorage["scoreCount"]);
        },

        getTopScores: function(count) {
            if (count < 1) { return null; }
            if (this.scoreArray.length < 1) {  this.init();  }

            var topScoresArray = [];
            //just do a blind copy now as proof of concept, quick sort later
            for (var i = 1; i <= localStorage['scoreCount']; i = i + 1) {
                topScoresArray[i] = localStorage['score_'+i];
            }
            return topScoresArray;
        }
});
});
