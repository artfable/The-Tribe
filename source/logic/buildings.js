/**
 * Created by artfable
 * 22.07.16
 */
;
(() => {
    'use strict';

    class Building {
        constructor(buildTime, strength, resources) {
            this.buildTime = buildTime;
            this.strength = strength;
            this.resources = resources || {};
        }
    }

    class LeaderHall extends Building {
        constructor() {
            super(0, 10);
        }
    }

    class Warehouse extends Building {
        constructor() {
            super(2, 20, {wood: 15});
            this.capacity = 1000;
        }
    }

    window.Game = window.Game || {};
    window.Game.Buildings = {
        LeaderHall: LeaderHall,
        Warehouse: Warehouse
    }
})();