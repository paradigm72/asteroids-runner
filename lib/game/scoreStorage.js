ig.module(
    'game.scoreStorage'
)
.requires(
    'impact.game'
)
.defines(function() {
    ScoreStorage = ig.Class.extend({

        init: function() {
//            for (var i = 0; i < localStorage['scoreCount']; i = i + 1) {
//                this.scoresArray[i] = localStorage['score_'+i];
//            }
        },

        getScoreCount: function() {
            return parseInt(localStorage.getItem('scoreCount'));
        },


        saveScoreSorted: function(thisScore) {
            var scoreCount = parseInt(localStorage.getItem('scoreCount'));

            //if there were no previous scores, just save the first one and be done
            if (isNaN(scoreCount)) {
                localStorage.setItem('scoreCount', 1);
                localStorage.setItem('score_0', thisScore);
                localStorage.setItem('date_0', this.getCurrentFormattedDateTime());
                return true;
            }

            //otherwise, loop until we find a score that's smaller, and shove in front of it
            for (var i = 0; i < scoreCount; i++) {
                if (localStorage.getItem('score_'+i) < thisScore) {

                    //copy up from the back. ScoreCount was the old count, but is the *new* last index
                    for (var j = scoreCount; j > i; j--)  {
                        localStorage.setItem('score_'+j, localStorage.getItem('score_'+ (j-1)));
                        localStorage.setItem('date_' +j, localStorage.getItem('date_' + (j-1)));
                    }

                    //put this current value in the now-empty spot
                    localStorage.setItem('score_'+i, thisScore.toString());
                    localStorage.setItem('date_' +i, this.getCurrentFormattedDateTime());

                    //update score count
                    var newScoreCount = scoreCount + 1;
                    localStorage.setItem('scoreCount', newScoreCount.toString());

                    //break the function
                    return;
                }
            }
            //if we never found a spot to put our new score, put it at the end:
            localStorage.setItem('score_'+scoreCount, thisScore.toString());
            var newScoreCount = scoreCount + 1;
            localStorage.setItem('scoreCount', newScoreCount);
        },

        getCurrentFormattedDateTime: function() {
            var myDate = new Date();

            return myDate.toLocaleString("en-US", {hour12: false});

//            //pad the minutes number with a leading zero if it's only one digit
//            if (myDate.getMinutes().length === 1) {
//                 myMinutesFormatted = "0" + myDate.getMinutes();
//            }
//            else {
//                myMinutesFormatted = myDate.getMinutes() + " ";
//            }
//
//            var returnString = myDate.getHours() + ":" + myMinutesFormatted + "  " +
//                               myDate.getMonth() + "-" + myDate.getDate() + "-" + myDate.getFullYear();
//            return returnString;
        },

        getTopScoresSorted: function(count) {
            var returnArray = [];

            if (count > localStorage.getItem('scoreCount')) { count = localStorage.getItem('scoreCount'); }
            for (var i = 0; i < count; i++)  {
                returnArray.push(localStorage.getItem('score_'+i));
            }
            return returnArray;
        },

        getTimesSorted: function(count) {
            var returnArray = [];

            if (count > localStorage.getItem('scoreCount')) { count = localStorage.getItem('scoreCount'); }
            for (var i = 0; i < count; i++)  {
                returnArray.push(localStorage.getItem('date_'+i));
            }
            return returnArray;
        }

//        saveScore: function(thisScore) {
//            var nextScoreIndex;
//            console.log("scoreCount="+localStorage.getItem('scoreCount'));
//            if (!isNaN(localStorage.getItem('scoreCount'))) {
//                nextScoreIndex = parseInt(localStorage.getItem('scoreCount')) + 1;
//            }
//            else {
//                nextScoreIndex = 0;
//            }
//            console.log("nextScoreIndex="+nextScoreIndex);
//            localStorage.setItem("score_" + nextScoreIndex.toString(), thisScore);
//            console.log("thisScore="+thisScore);
//            localStorage.setItem("scoreCount", nextScoreIndex);
//            console.log("score_"+nextScoreIndex+"="+localStorage.getItem("score_"+nextScoreIndex));
//            console.log("scoreCount="+localStorage.getItem("scoreCount"));
//        },
//
//        getTopScores: function(count) {
//            if (count < 1) { return null; }
//            if (this.scoresArray.length < 1) {  this.init();  }
//
//            console.log("scoreCount="+localStorage.getItem("scoreCount"));
//
//            //copy into local array for sorting
//            for (var i = 0; i <= localStorage.getItem('scoreCount'); i = i + 1) {
//                this.scoresArray[i] = localStorage.getItem('score_'+i);
//                console.log("topScoresArray["+i+"]="+this.scoresArray[i]);
//            }
//
//            this.scoresArray = this.sortScoresArray(this.scoresArray);
//            return this.scoresArray;
//        },
//
//        //QuickSort
//        sortScoresArray: function(scoresArray) {
//            //debug - signature for each recursive call
//            for (var i = 0; i < scoresArray.count; i = i + 1) {
//                console.log(scoresArray[i]);
//            }
//
//            //if we somehow called with an empty array, return nothing
//            if (scoresArray.length === 0) { return []; }
//
//            //if we have only a single element, just return it (end the recursion)
//            if (scoresArray.length === 1) { return scoresArray[0]; }
//
//            //define the pivot point
//            var pivotIdx = Math.round(scoresArray.length / 2);
//            var pivotValue = scoresArray[pivotIdx];
//
//            //split into two sub-arrays, lesser than pivot and greater than pivot
//            var testValue;
//            var lesserArray = [];
//            var greaterArray = [];
//            for (var testIdx = 0; testIdx <= scoresArray.length; testIdx++) {
//                testValue = scoresArray[testIdx];
//                if (testIdx === pivotIdx)  { continue; }
//                else if (testValue < pivotValue)  { lesserArray.push(testValue); }
//                else if (testValue >= pivotValue) { greaterArray.push(testValue);}
//            }
//
//            //sort the sub-arrays
//            lesserArray = this.sortScoresArray(lesserArray);
//            greaterArray = this.sortScoresArray(greaterArray);
//
//            //return the concatenation of the two sorted sub-arrays, with the pivot in the middle
//            // note that we're doing a reverse sort, so the greater is on the left
//            var returnArray = [];
//            for (var i = 0; i < greaterArray.length; i++) { returnArray.push(greaterArray[i]); }
//            returnArray.push(pivotValue);
//            for (var i = 0; i < lesserArray.length; i++)  { returnArray.push(lesserArray[i]); }
//            return returnArray;
//        }


});
});
