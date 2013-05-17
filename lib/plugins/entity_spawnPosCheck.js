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

                if (Math.abs(yPos - screenTop) < this.size.y) {
                    return true;
                }
                else {
                    return false;
                }
            },

            isNearTopRow: function() {
                var yPos = this.pos.y;
                var screenTop = ig.game.screen.y + ig.game.consts.spawnOffset;

                if (Math.abs(yPos - screenTop) < this.size.y * 3) {
                    return true;
                }
                else {
                    return false;
                }
            }

        });
    });

