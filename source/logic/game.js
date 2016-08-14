/**
 * @author sbt-veselov-as
 * 13.07.2016
 */
;
(() => {
    'use strict';

    let Tribe = window.Game.Tribe;
    let AITribe = window.Game.AITribe;
    let Environment = window.Game.Settings.Environment;
    let IllegalArgumentException = window.Game.Exceptions.IllegalArgumentException;

    class Game {
        constructor() {
            this.tribe = new Tribe();
            this.environment = new Environment();
            this.events = {};
            this.enemies = new Set();
        }

        _startLive(environment) {
            console.log('Tribe start living');
            this.liveIntervalId = setInterval(() => {
                this.tribe._step(environment);
                this.trigger('step', this);
            }, MINUTE_IN_MILLISECONDS);
        }

        start() {
            this._startLive(this.environment);
        }

        stopLive() {
            console.log('Tribe stop living');
            clearInterval(this.liveIntervalId);
            this.enemies.forEach(enemy => {
                enemy.stopLive();
            });
        }

        build(buildingName) {
            let buildingMeta = BUILDINGS[buildingName];
            if (!buildingMeta) {
                throw new IllegalArgumentException('No such building\'s type [' + buildingName + ']');
            }
            let building = buildingMeta.create();
            this.tribe.build(building, () => {
                this.trigger('buildComplete', this, building);
            });
            this.trigger('buildStart', this);
        }

        addUnits(unitsName, count) {
            if (!count || count < 0) {
                throw new IllegalArgumentException('Amount of units must be positive');
            }
            let unitsMeta = UNITS[unitsName];
            if (!unitsMeta) {
                throw new IllegalArgumentException('No such unit\'s type [' + unitsName + ']');
            }
            let units = unitsMeta.create();
            units.count = count;
            this.tribe.addUnits(units, () => {
                this.trigger('endTraining', this);
            });
            this.trigger('startTraining', this);
        }

        addEnemy() {
            let aiTribe = new AITribe(this.environment);
            this.enemies.add(aiTribe);
            aiTribe.startLive();
            console.log(aiTribe.name + ' were added');
        }

        on(event, action) {
            if (this.events[event]) {
                this.events[event].push(action);
            } else {
                this.events[event] = [action];
            }
        }

        off(event) {
            delete this.events[event];
        }

        trigger(event, ...params) {
            if (this.events[event]) {
                this.events[event].forEach(action => {
                    action(event, ...params);
                });
            }
        }
    }

    window.game = new Game();
})();