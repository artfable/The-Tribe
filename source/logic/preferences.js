/**
 * Created by artfable
 * 22.07.16
 */
;
(() => {
    'use strict';
    class Environment {
        constructor() {
            this.growing = 1.15;
            this.agronomy = 1;
            this.hunting = 2;
            this.eating = 1;
        }
    }

    class TribeSettings {
        constructor() {
            this.modificators = {
                war: 1,
                grow: 1,
                agronomy: 1,
                hunt: 1,
                eat: 1,
                productivity: 1
            };
        }
    }

    class IllegalArgumentException extends Error {
        constructor(message) {
            super(message);
        }
    }

    window.Game = window.Game || {};
    window.Game.Settings = {
        Environment: Environment,
        TribeSettings: TribeSettings
    };

    window.Game.Exceptions = {
        IllegalArgumentException: IllegalArgumentException
    };
})();