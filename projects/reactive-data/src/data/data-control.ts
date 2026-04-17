import { forEach, isNil, toPath, reduce, keys } from 'lodash-es';
import Data from './data';
import PropertyAccess from './property-access';
import Configuration from '../configuration/configuration';
import { State, getHighestState } from './state-constant';

const LISTENERS = Symbol('listeners');

type Listeners = { [key: number]: Function };

type ListenersGroup = {
	[LISTENERS]?: Listeners;
	[key: string]: ListenersGroup;
};

type TriggerListenersGroup = {
	[key: string]: ListenersGroup;
};

class DataControl {
	#dataInterface?: Data;
	#onChangedAtListeners: ListenersGroup = {};
	#onChangeListeners: Listeners = {}
	#onInternalChangeEndListeners: Listeners = {};
	#lastUsedListenerId = 0;
	#rootPropertyAccess: PropertyAccess;
	#state: State = State.idle;
	#onStateChangeListeners: { [key: string]: Function } = {};
	#propertyStates: {
		[key: string]: {
			[key: string]: boolean
		}
	} = {};
	#invalidProperties: {
		[key: string]: PropertyAccess
	} = {};

	constructor(configuration: Configuration, initial: any) {
		this.#rootPropertyAccess = configuration.getModel().build({
			initial,
			dataControl: this,
			path: [],
		});
	}

	async initialize() {
		await this.#rootPropertyAccess.initialize();
	}

	async finalize(data: Data) {
		this.#dataInterface = data;
	}

	getInterface(): Data {
		if (isNil(this.#dataInterface)) {
			throw new Error('DataControl not finalized yet');
		}

		return this.#dataInterface;
	}

	onChange(cb: (propertyAccess: PropertyAccess) => void) {
		const usedId = this.#lastUsedListenerId++;

		this.#onChangeListeners[usedId] = cb;

		return () => {
			delete this.#onChangeListeners![usedId];
		};
	}

	onChangedAt(path: string | string[], cb: (propertyAccess: PropertyAccess) => void) {
		const segments = toPath(path);

		const target = reduce(segments, (acc, segment) => {
			let child = acc[segment];

			if (isNil(child)) {
				child = {};

				acc[segment] = child;
			}

			return child;
		}, this.#onChangedAtListeners);

		if (isNil(target[LISTENERS])) {
			target[LISTENERS] = {};
		}

		const usedId = this.#lastUsedListenerId++;

		target[LISTENERS][usedId] = cb;

		return () => {
			delete target[LISTENERS]![usedId];
		};
	}

	changed(propertyAccess: PropertyAccess) {
		forEach(this.#onChangeListeners, (listener) => {
			listener(propertyAccess);
		});
	}

	changedAt(propertyAccess: PropertyAccess) {
		let listenersGroup = this.#onChangedAtListeners;


		forEach(propertyAccess.getPath(), (segment) => {
			listenersGroup = listenersGroup[segment];

			if (isNil(listenersGroup)) {
				return false;
			}

			return true;
		});

		if (!isNil(listenersGroup)) {
			forEach(listenersGroup[LISTENERS], (listener) => {
				listener(propertyAccess);
			});
		}
	}

	getPropertyAccessAt(path: string[]): PropertyAccess {
		return this.#rootPropertyAccess.getPropertyAccessAt(path);
	}

	onStateChange(listener: Function): () => void {
		const id = this.#lastUsedListenerId++

		this.#onStateChangeListeners[id] = listener;

		return () => {
			delete this.#onStateChangeListeners[id];
		};
	}

	stateChangedAt(propertyAccess: PropertyAccess, previousPropertyState: State) {
		const state = propertyAccess.getState();

		if (state === State.idle) {
			if (propertyAccess.isValid()) {
				delete this.#invalidProperties[propertyAccess.getUuid()];
			} else {
				this.#invalidProperties[propertyAccess.getUuid()] = propertyAccess;
			}
		}

		if (!isNil(this.#propertyStates[previousPropertyState])) {
			delete this.#propertyStates[previousPropertyState][propertyAccess.getUuid()];
			
			if (keys(this.#propertyStates[previousPropertyState]).length <= 0) {
				delete this.#propertyStates[previousPropertyState];
			}
		}
		
		if (isNil(this.#propertyStates[state])) {
			this.#propertyStates[state] = {};
		}

		this.#propertyStates[state][propertyAccess.getUuid()] = true;

		// get highest overall state of all rules
		const highest = getHighestState(keys(this.#propertyStates) as State[]);

		// The state for the property has changed if this is true.
		if (this.#state === highest) {
			return;
		}

		const previousState = this.#state;
		this.#state = highest;

		forEach(this.#onStateChangeListeners, (listener) => listener(this.#state, previousState));
	}

	onInternalChangeEnd(listener: Function) {
		const id = this.#lastUsedListenerId++;

		this.#onInternalChangeEndListeners[id] = listener;

		return () => {
			delete this.#onInternalChangeEndListeners[id];
		};
	}

	isValid() {
		return keys(this.#invalidProperties).length <= 0;
	}

	async validate() {
		await this.#rootPropertyAccess.validate();
	}
}

export default DataControl;