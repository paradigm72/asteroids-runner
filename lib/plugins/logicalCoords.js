ig.module(
  'plugins.logicalCoords'
)
.requires(
  'impact.entity',
  'impact.game'
)
.defines(function() {
    ig.Game.inject({
        logicalRatio: function() {
            var xRatio = this.consts.screenWidth / 100;
            var yRatio = this.consts.screenHeight / 100;
            return { x: xRatio, y: yRatio};
        }

    });

    ig.Entity.inject({
        //Return the logical coordinates (normalized to 0 to 100) of the entity
        logicalPos: function() {
            var xPos = this.pos.x / ig.game.logicalRatio().x;
            var yPos = this.pos.y / ig.game.logicalRatio().y;
            return { x: xPos, y: yPos};            
        },
        
        //Update the x or y coordinates of the entity using the logical position
        setLogicalX: function(x, useCenter) {
            if (useCenter === true) {
                this.pos.x = x * ig.game.logicalRatio().x - this.size.x / 2;
            }
            else {
                this.pos.x = x * ig.game.logicalRatio().x;
            }
        },
        setLogicalY: function(y) {
            this.pos.y = y * ig.game.logicalRatio().y;
        }
    });
});

