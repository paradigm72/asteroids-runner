ig.module(
    'game.entityFactory'
)
.requires(
    'impact.game',
    'impact.entity'
)
.defines(function() {
    EntityFactory = ig.Class.extend({

        spawnRandomObstacles: function(NameOfObject, PercentChancePerFrame) {
            //random location on screen width, without falling off the right edge
            var xPos = Math.floor((Math.random() *
                (ig.game.consts.screenWidth - eval(NameOfObject).prototype.size.x)+1));
            var chanceToSpawn = Math.floor((Math.random()*1000)+1);
            if (chanceToSpawn > (1000 - 10 * parseFloat(PercentChancePerFrame))) {
                if (this.canSpawnNew(NameOfObject)) {
                    //console.log("Spawned new " + ObjectToSpawn.prototype.name + " at [" + xPos + "]");
                    ig.game.spawnEntity(eval(NameOfObject), xPos, ig.game.screen.y +
                                                                  ig.game.consts.spawnOffset);
                }
            }
        },

        canSpawnNew: function(NameOfObject) {
            var walls = ig.game.getEntitiesByType(EntityWall);
            var asteroids = ig.game.getEntitiesByType(EntityAsteroid);
            var canSpawn = { 'asteroid': true, 'wall': true};

            //check for walls in the top row
            for (var i = 0; i < walls.length; i++) {
                if (walls[i].isOnTopRow()) {
                    //found something in the top 'row', so quit with false
                    return false;
                    //console.log("Try to spawn " + ObjectToSpawn.prototype.name +
                    //            " at screen height: " + ig.game.screen.y +
                    //            ", found wall[" + i + "] at height" + walls[i].pos.y);
                }
            }

            //check for asteroids in the top row
            for (var i = 0; i < asteroids.length; i++) {
                if (asteroids[i].isOnTopRow()) {
                    //found something in the top 'row', so quit with false
                    return false;
                    //console.log("Try to spawn " + ObjectToSpawn.prototype.name +
                    //           " at screen height: " + ig.game.screen.y +
                    //            ", found asteroid[" + i + "] at height" + asteroids[i].pos.y);
                }
            }

            //check for walls anywhere near the top rows (avoid an impassable level)
            for (var i = 0; i < walls.length; i++) {
                if (walls[i].isNearTopRow()) {
                    //found something near the top 'row', so quit with false for walls (asteroids ok)
                    if (NameOfObject === "EntityWall") {
                        return false;
                    }
                    else if (NameOfObject === "EntityAsteroid") {
                        return true;
                    }
                    //console.log("Try to spawn " + ObjectToSpawn.prototype.name +
                    //            " at screen height: " + ig.game.screen.y +
                    //            ", found wall[" + i + "]at height" + walls[i].pos.y);
                }
            }

            //if we didn't find anything in the top row, or any walls near the top row, ok to spawn
            return true;
        }
    })
});



