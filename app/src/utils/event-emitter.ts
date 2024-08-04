/**
 * Callback for event listeners
 * @date 10/12/2023 - 1:46:22 PM
 *
 * @typedef {ListenerCallback}
 */
type ListenerCallback<T> = (data: T) => void;

/**
 * Event emitter object, this is used to emit events and listen for events
 * To typesafe the events, use the generic parameter
 * To typesafe callback parameters, it is recommended to either use inheritance of composition
 * @date 10/12/2023 - 1:46:22 PM
 *
 * @export
 * @class EventEmitter
 * @typedef {EventEmitter}
 * @template [allowedEvents=(string | number | '*')]
 */
export class EventEmitter<Events = Record<string, unknown>> {
    /**
     * All events and their listeners as a map
     * @date 10/12/2023 - 1:46:22 PM
     *
     * @public
     * @readonly
     * @type {Map<allowedEvents, ListenerCallback[]>}
     */
    public readonly events = new Map<keyof Events, ListenerCallback<Events[keyof Events]>[]>();

    /**
     * Adds a listener for the given event
     * @date 10/12/2023 - 1:46:22 PM
     *
     * @param {allowedEvents} event
     * @param {ListenerCallback} callback
     */
    on<K extends keyof Events>(event: K, callback: ListenerCallback<Events[K]>) {
        if (typeof event !== 'string' && typeof event !== 'number') {
            throw new Error('Event must be a string');
        }
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }

        this.events.get(event)?.push(callback as ListenerCallback<Events[keyof Events]>);
    }

    /**
     * Emits an event with the given arguments
     * @date 10/12/2023 - 1:46:22 PM
     *
     * @param {allowedEvents} event
     * @param {...unknown[]} data
     */
    emit<K extends keyof Events>(event: K, data: Events[K]) {
        if (typeof event !== 'string' && typeof event !== 'number') {
            throw new Error('Event must be a string');
        }
        if (!this.events.has(event)) {
            return;
        }

        this.events.get(event)?.forEach(callback => callback(data));
        this.events
            .get('*' as keyof Events)
            ?.forEach(callback => callback(data));
    }

    /**
     * Removes a listener for the given event
     * @date 10/12/2023 - 1:46:22 PM
     *
     * @param {allowedEvents} event
     * @param {?ListenerCallback} [callback]
     */
    off<K extends keyof Events>(event: K, callback?: ListenerCallback<Events[K]>) {
        if (typeof event !== 'string' && typeof event !== 'number') {
            throw new Error('Event must be a string');
        }
        if (!this.events.has(event)) {
            return;
        }

        if (callback) {
            this.events.set(
                event,
                this.events.get(event)?.filter(cb => cb !== callback) ?? []
            );
        } else {
            this.events.set(event, []);
        }
    }

    /**
     * Adds a listener for the given event, but removes it after it has been called once
     * @param event
     * @param callback
     */
    once<K extends keyof Events>(event: K, callback: ListenerCallback<Events[K]>) {
        const onceCallback = (data: Events[K]) => {
            callback(data);
            this.off(event, onceCallback);
        };

        this.on(event, onceCallback);
    }

    /**
     * Removes all listeners for all events
     * @date 10/12/2023 - 1:46:22 PM
     */
    destroy() {
        for (const event of Object.keys(this.events)) {
            this.off(event as keyof Events);
        }
    }
}
