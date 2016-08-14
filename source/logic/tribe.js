/**
 * Created by artfable
 * 22.07.16
 */
;(() => {
    'use strict';

    let TribeSettings = window.Game.Settings.TribeSettings;
    let LeaderHall = window.Game.Buildings.LeaderHall;
    let Warehouse = window.Game.Buildings.Warehouse;
    let IllegalArgumentException = window.Game.Exceptions.IllegalArgumentException;

    class Storage {
        constructor(food, stone, wood) {
            this.food = food;
            this.stone = stone;
            this.wood = wood;

            this._CAPACITY = 400;
        }

        checkToBuild(building) {
            return this.check(building.resources);
        }

        useForBuild(building) {
            this.use(building.resources);
        }

        check(cost) {
            for (let resource in cost) {
                if (this[resource] < cost[resource]) {
                    return false;
                }
            }
            return true;
        }

        use(cost) {
            for (let resource in cost) {
                this[resource] -= cost[resource];
            }
        }

        liveStep(peopleNumber, environment, tribeSettings) {
            this.food -= peopleNumber * environment.eating * tribeSettings.modificators.eat;
            this.food += peopleNumber * environment.agronomy * tribeSettings.modificators.agronomy;
            this.wood += peopleNumber * tribeSettings.modificators.productivity;

            this._solveOverflow();
        }

        addWareHouse(warehouse) {
            this.warehouse = warehouse;
        }

        _solveOverflow() {
            let maxCapacity = this._CAPACITY + (this.warehouse ? this.warehouse.capacity : 0);
            ['food', 'stone', 'wood'].forEach(resourceName => {
                this[resourceName] = this[resourceName] > maxCapacity ? maxCapacity : this[resourceName];
            });
        }
    }

    class Tribe {
        constructor() {
            this.people = 20;
            this.units = [];
            this.storage = new Storage(40, 0, 10);
            this.buildings = [new LeaderHall()];
            this.settings = new TribeSettings();
        }

        _step(environment) {
            this.storage.liveStep(this.people, environment, this.settings);
            this.units.forEach(units => {
                this.storage.food += units.hunt() * this.settings.modificators.hunt * environment.hunting;
                this.storage.food -= units.eat * units.count * this.settings.modificators.eat * environment.eating;
            });
            this.people = Math.round(this.people * environment.growing);
        }

        _markBuilding(building) {
            if (building instanceof Warehouse) {
                this.storage.addWareHouse(building);
            }

        }

        build(building, callback) {
            if (this.buildings.find(obj => building instanceof obj.constructor)) {
                throw new IllegalArgumentException('Building with type "' + building.constructor.name + '" is already exists');
            }

            if (!this.storage.checkToBuild(building)) {
                throw new IllegalArgumentException('Not enough resources for ' + building.constructor.name);
            }
            this.storage.useForBuild(building);
            setTimeout(() => {
                this.buildings.push(building);
                this._markBuilding(building);
                console.log(building.constructor.name + ' was built');
                if (callback) {
                    callback();
                }
            }, building.buildTime * MINUTE_IN_MILLISECONDS);
            console.log(building.constructor.name + ' will be build after ' + building.buildTime + ' minutes');
        }

        addUnits(units, callback) {
            if ((this.people - 15) < units.totalCost.people) {
                throw new IllegalArgumentException('Not enough people for train units');
            }
            let resourceCost = Object.assign({}, units.totalCost);
            delete resourceCost.people;
            if (!this.storage.check(resourceCost)) {
                throw new IllegalArgumentException('Not enough resources for ' + units.count + ' ' + units.constructor.name);
            }
            this.storage.use(resourceCost);
            this.people -= units.totalCost.people;
            console.log('Start training ' + units.constructor.name + ', for ' + (units.training * units.count) + ' minutes');
            setTimeout(() => {
                let ownedUnits = this.units.find(unitCrowd => {
                    return unitCrowd instanceof units.constructor;
                });
                if (ownedUnits) {
                    ownedUnits.count += units.count;
                } else {
                    this.units.push(units);
                }
                console.log(units.constructor.name + ' are ready');
                if (callback) {
                    callback();
                }
            }, (units.training * units.count) * MINUTE_IN_MILLISECONDS);
        }
    }

    window.Game = window.Game || {};
    window.Game.Tribe = Tribe;
})();