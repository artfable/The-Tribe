/**
 * Created by artfable
 * 19.07.16
 */
;document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    window.game.start();

    let step = 0;

    let draw = (eventName, game) => {
        if (eventName == 'step') {
            step++;
        }
        let stepNode = document.getElementById('step');
        stepNode.innerHTML = step;

        let peopleNode = document.getElementById('tribe_people');
        peopleNode.innerHTML = game.tribe.people;

        let foodNode = document.getElementById('tribe_store_food');
        foodNode.innerHTML = game.tribe.storage.food;

        let woodNode = document.getElementById('tribe_store_wood');
        woodNode.innerHTML = game.tribe.storage.wood;

        let stoneNode = document.getElementById('tribe_store_stone');
        stoneNode.innerHTML = game.tribe.storage.stone;

        let buildingsNode = document.getElementById('tribe_buildings');
        let buildingTitle = buildingsNode.firstElementChild;
        buildingsNode.innerHTML = '';
        buildingsNode.appendChild(buildingTitle);
        game.tribe.buildings.forEach(building => {
            buildingsNode.appendChild(document.createElement('br'));
            let buildingNode = document.createElement('span');
            buildingNode.innerHTML = building.constructor.name;
            buildingsNode.appendChild(buildingNode);
        });

        let unitsNode = document.getElementById('tribe_units');
        let unitsTitle = unitsNode.firstElementChild;
        unitsNode.innerHTML = '';
        unitsNode.appendChild(unitsTitle);
        game.tribe.units.forEach(unitMeta => {
            unitsNode.appendChild(document.createElement('br'));
            let unitMetaNode = document.createElement('span');
            unitMetaNode.innerHTML = unitMeta.constructor.name;
            unitsNode.appendChild(unitMetaNode);
            let countNode = document.createElement('span');
            countNode.innerHTML = ' ' + unitMeta.count;
            unitsNode.appendChild(countNode);
        });
    };

    draw('step', window.game);

    window.game.on('step', draw);
    window.game.on('buildComplete', draw);
    window.game.on('buildStart', draw);
    window.game.on('startTraining', draw);
    window.game.on('endTraining', draw);
});