ig.module(
    'game.shieldMeter'
)
.requires(
    'impact.game',
    'impact.entity'
)
.defines(function() {
    ShieldMeter = ig.Class.extend({
        consts: {
            maxShieldStrength: 100,
            defaultShieldAddIncrement: 10,
            defaultShieldDrainIncrement: { active: 5, disabled: 2 }
        },
        currentShieldStrength: 0,
        isShieldPulsing: false,

        reset: function() {
            this.shieldTimer.reset();
            this.currentShieldStrength = 0;
            this.isShieldPulsing = false;
        },

        init: function() {
            this.shieldTimer = new ig.Timer();
        },

        addStrength: function(strengthToAdd) {
            if (isNaN(strengthToAdd) || strengthToAdd < 0) {
                strengthToAdd = this.consts.defaultShieldAddIncrement;
            }
            this.currentShieldStrength += strengthToAdd;

            if (this.currentShieldStrength >= this.consts.maxShieldStrength) {
                this.isShieldPulsing = true;
            }
        },

        removeStrength: function(strengthToRemove) {
            if (this.currentShieldStrength <= 0) {
                return;
            }

            if (isNaN(strengthToRemove) || strengthToRemove < 0) {
                if (this.isShieldPulsing) {
                    strengthToRemove = this.consts.defaultShieldDrainIncrement.active;
                }
                else {
                    strengthToRemove = this.consts.defaultShieldDrainIncrement.disabled;
                }
            }
            this.currentShieldStrength -= strengthToRemove;

            if (this.currentShieldStrength <= 0) {
                this.isShieldPulsing = false;
            }
        },

        update: function() {
            if (this.shieldTimer.delta() >= 1) {
                this.shieldTimer.reset();
                this.removeStrength();
                //console.log("Strength: " + this.currentShieldStrength + " (shield: " + this.isShieldPulsing + ")");
            }
        }
    });
});