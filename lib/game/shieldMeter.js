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
            fadingStrengthCutoff: 25,
            defaultShieldAddIncrement: 10,
            defaultShieldDrainIncrement: { active: 2, disabled: 0.2 }
        },
        currentShieldStrength: 0,
        isShieldOn: false,
        isShieldFading: false,
        toggleShieldCallback: null,  //set by game object
        fadingShieldCallback: null,

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
                this.setShieldOn();
            }
            if (this.currentShieldStrength >= this.consts.fadingStrengthCutoff) {
                this.setShieldNotFading();
            }
        },

        removeStrength: function(strengthToRemove) {
            if (this.currentShieldStrength <= 0) {
                return;
            }

            if (isNaN(strengthToRemove) || strengthToRemove < 0) {
                if (this.isShieldOn) {
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
            if (this.currentShieldStrength <= this.consts.fadingStrengthCutoff)  {
                this.setShieldFading();
            }
        },

        setShieldOn: function() {
            if (this.isShieldOn === true) { return; }
            this.toggleShieldCallback(true);
            this.isShieldOn = true;
        },

        setShieldOff: function() {
            if (this.isShieldOn === false) { return; }
            this.toggleShieldCallback(false);
            this.isShieldOn = false;
        },

        setShieldFading: function() {
            if (this.isShieldFading === true) { return; }
            if (this.isShieldOn === false)  { return; }  //only applies if the shield is on
            this.isShieldFading = true;
            this.fadingShieldCallback(true);
        },

        setShieldNotFading: function() {
            if (this.isShieldFading === false) { return; }
            if (this.isShieldOn === false)  { return; }  //only applies if the shield is on
            this.isShieldFading = false;
            this.fadingShieldCallback(false);
        },

        update: function() {
            if (this.shieldTimer.delta() >= 0.1) {
                this.shieldTimer.reset();
                this.removeStrength();
                //console.log("Strength: " + this.currentShieldStrength + " (shield: " + this.isShieldOn + ")");
            }
        }
    });
});