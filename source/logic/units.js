/**
 * Created by artfable
 * 22.07.16
 */
;
(() => {
    'use strict';

    class Units {
        constructor(hp, attack, rangeAttack, canHunt, eat, training, capacity, cost) {
            this.count = 0;
            this.hp = hp;
            this.attack = attack;
            this.rangeAttack = rangeAttack;
            this.canHunt = canHunt;
            this.eat = eat;
            this.training = training;
            this.capacity = capacity;
            this.costPerUnit = cost;
        }

        get totalCost() {
            let cost = {};
            for (let resource in this.costPerUnit) {
                cost[resource] = this.costPerUnit[resource] * this.count;
            }
            return cost;
        }

        heart(value) {
            let afterHeart = this.count * this.hp - value;
            if (afterHeart <= 0) {
                this.count = 0;
                return -afterHeart;
            }

            this.count = Math.round(afterHeart / this.hp);
            return 0;
        }

        hunt() {
            if (this.canHunt) {
                return this.count * 2;
            }

            return 0;
        }
    }

    class Warriors extends Units {
        constructor() {
            super(4, 2, 0, true, 2, 1, 10, {food: 10, wood: 5, people: 1});
        }
    }

    window.Game = window.Game || {};
    window.Game.Units = {
        Warriors: Warriors
    };
})();