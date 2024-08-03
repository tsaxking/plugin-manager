import { EventEmitter } from "../utils/event-emitter";
import { attemptAsync } from "../utils/check";


export class Controller<T extends string | number> {
    private _data = new WritableStream<T>();

    constructor(public readonly id: number, private _value: T) {

    }


    public get value() {
        return this._value;
    }

    public set value(value: T) {
        this._value = value;
    }

    public startStream() {
    }
}