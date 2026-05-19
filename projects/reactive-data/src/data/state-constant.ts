import { forEach } from "lodash-es";

export enum State {
	idle = 'idle',
	updating = 'updating',
	validating = 'validating',
}

export const highestState = State.validating;
export const lowestState = State.idle;

export function getStatePriority(state: State): number {
	switch (state) {
		case State.validating:
			return 2;
		case State.updating:
			return 1;
		default:
			return 0;
	}
}

export function getHighestState(states: State[]) {
	let highest = lowestState;

	forEach(states, (state) => {
		if (state === highestState) {
			highest = state;

			return false;
		}

		if (getStatePriority(state) > getStatePriority(highest)) {
			highest = state;
		}

		return undefined;
	});

	return highest;
}