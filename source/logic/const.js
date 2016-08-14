/**
 * Created by artfable
 * 22.07.16
 */
const SECOND_IN_MILLISECONDS = 1000;
const MINUTE_IN_MILLISECONDS = SECOND_IN_MILLISECONDS * 60;
const AI_DECISION_STEP = 10 * MINUTE_IN_MILLISECONDS;
const BUILDINGS = {
    LEADER_HALL: {
        name: 'LeaderHall',
        create() {
            return new window.Game.Buildings.LeaderHall();
        }
    },
    WAREHOUSE: {
        name: 'Warehouse',
        create() {
            return new window.Game.Buildings.Warehouse();
        }
    }
};
const UNITS = {
    WARRIORS: {
        name: 'Warriors',
        create() {
            return new window.Game.Units.Warriors();
        }
    }
};