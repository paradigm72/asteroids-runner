ig.module(
        'plugins.entity_spawnPosCheck'
    )
    .requires(
        'impact.entity',
        'impact.game'
    )
    .defines(function() {
        ig.Entity.inject({
            isOnTopRow: function() {
                var yPos = this.pos.y;
                var screenTop = ig.game.screen.y + ig.game.consts.spawnOffset;

                //8 px buffer to prevent entities from being stacked *right* on top of each other
                if (Math.abs(yPos - screenTop) < this.size.y + 8) {
                    return true;
                }
                else {
                    return false;
                }
            },

            isNearTopRow: function() {
                var yPos = this.pos.y;
                var screenTop = ig.game.screen.y + ig.game.consts.spawnOffset;

                //first 4 entity-heights count as "near" the top row
                if (Math.abs(yPos - screenTop) < this.size.y * 4) {
                    return true;
                }
                else {
                    return false;
                }
            }

        });
    });

