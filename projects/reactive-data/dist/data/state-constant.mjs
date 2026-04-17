import { forEach } from 'lodash-es';

var State;
(function (State) {
    State["idle"] = "idle";
    State["updating"] = "updating";
    State["validating"] = "validating";
})(State || (State = {}));
const highestState = State.validating;
const lowestState = State.idle;
function getHighestState(states) {
    let highest = lowestState;
    forEach(states, (state) => {
        if (state === highestState) {
            highest = state;
            return false;
        }
        if (getStatePriority(state) > getStatePriority(highest)) {
            highest = state;
        }
    });
    return highest;
}
function getStatePriority(state) {
    switch (state) {
        case State.validating:
            return 2;
        case State.updating:
            return 1;
        default:
            return 0;
    }
}

export { State, getHighestState, getStatePriority, highestState, lowestState };
