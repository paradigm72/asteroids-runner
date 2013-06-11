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
            defaultShieldDrainIncrement: { active: 2, disabled: 0.2 }
        },
        currentShieldStrength: 0,
        isShieldPulsing: false,
        toggleShieldCallback: null,  //set by game object

        reset: function() {
            this.shieldTimer.reset();
            this.currentShieldStrength = 0;
            this.setShieldOff();
        },

        init: function() {
            this.shieldTimer = new ig.Timer();
        },

        addStrength: function(strengthToAdd) {
            if (this.currentShieldStrength >= this.consts.maxShieldStrength) {
                return;
            }

            if (isNaN(strengthToAdd) || strengthToAdd < 0) {
                strengthToAdd = this.consts.defaultShieldAddIncrement;
            }
            this.currentShieldStrength += strengthToAdd;

            if (this.currentShieldStrength >= this.consts.maxShieldStrength) {
                this.setShieldPulsing();
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
                this.setShieldOff();
            }
        },

        setShieldPulsing: function() {
            if (this.isShieldPulsing === true) { return; }
            this.toggleShieldCallback(true);
            this.isShieldPulsing = true;
        },

        setShieldOff: function() {
            if (this.isShieldPulsing === false) { return ;}
            this.toggleShieldCallback(false);
            this.isShieldPulsing = false;
        },

        update: function() {
            if (this.shieldTimer.delta() >= 0.1) {
                this.shieldTimer.reset();
                this.removeStrength();
                //console.log("Strength: " + this.currentShieldStrength + " (shield: " + this.isShieldPulsing + ")");
            }
        }
    });
});