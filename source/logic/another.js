/**
 * Created by artfable
 * 23.07.16
 */
;
(() => {
    'use strict';

    let Tribe = window.Game.Tribe;

    class AITribe {
        constructor(environment, name) {
            this.name = name || 'AI_' + Math.round(Math.random() * 100);
            this.tribe = new Tribe();
            this.environment = environment;
        }

        startLive() {
            console.log('Tribe [' + this.name + '] start living');
            this.liveIntervalId = setInterval(() => {
                this.tribe._step(this.environment);
            }, MINUTE_IN_MILLISECONDS);

            this.nextBuildings = [];
            for (let building in BUILDINGS) {
                this.nextBuildings.push(BUILDINGS[building].create());
            }
            this.nextBuildings.shift();
            this.nextBuildings.sort((b1, b2) => {
                let resources1 = (b1.resources.wood || 0) + (b1.resources.food || 0);
                let resources2 = (b2.resources.wood || 0) + (b2.resources.food || 0);
                return resources2 - resources1;
            });
            this.decisionIntervalId = setInterval(() => {
                if (this.nextBuildings.length > 0 && this.tribe.storage.check(this.nextBuildings[this.nextBuildings.length - 1].resources)) {
                    this.tribe.build(this.nextBuildings.pop(), () => {
                        console.log(this.name + ' have built sth');
                    });
                }
                let stillFood = this.tribe.storage.food;
                let stillWood = this.tribe.storage.wood;
                let warriors = UNITS.WARRIORS.create();
                let allowedByFood = Math.floor(stillFood / warriors.costPerUnit.food);
                let allowedByWood = Math.floor(stillWood / warriors.costPerUnit.wood);
                let allowedUnits = Math.min(allowedByFood, allowedByWood);

                if (allowedUnits > 0) {
                    warriors.count = Math.round((Math.random() * 1000) % allowedUnits) + 1;
                    this.tribe.addUnits(warriors, () => {
                        console.log(this.name + ' have trained ' + warriors.count + ' warriors');
                    });
                }
            }, AI_DECISION_STEP);
        }

        stopLive() {
            console.log('Tribe [' + this.name + '] stop living');
            clearInterval(this.liveIntervalId);
            clearInterval(this.decisionIntervalId);
        }
    }

    window.Game = window.Game || {};
    window.Game.AITribe = AITribe;
})();