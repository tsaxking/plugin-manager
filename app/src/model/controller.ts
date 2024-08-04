import { call } from '../utils/tauri';
import { EventEmitter } from '../utils/event-emitter';
import { socket } from '../utils/socket';

type ControllerType = 'number' | 'string' | 'boolean';
type ControllerValue<T extends ControllerType> = T extends 'number' ? number : T extends 'string' ? string : boolean;


class Controller<T extends ControllerType> {
    public static readonly controllers = new Map<number, Controller<ControllerType>>();

    private readonly em = new EventEmitter<{
        change: T;
    }>();

    constructor(
        public readonly id: number, 
        public readonly type: T, 
        public _value: ControllerValue<T>
    ) {}

    get value(): ControllerValue<T> {
        return this._value;
    }

    set value(value: ControllerValue<T>) {
        this._value = value;
        call(`change_controller_value_${this.type}`, {
            id: this.id,
            value
        });
    }
}

export class NumberController extends Controller<'number'> {
    constructor(id: number, value: number) {
        super(id, 'number', value);
    }
}

export class StringController extends Controller<'string'> {
    constructor(id: number, value: string) {
        super(id, 'string', value);
    }
}

export class BooleanController extends Controller<'boolean'> {
    constructor(id: number, value: boolean) {
        super(id, 'boolean', value);
    }
}

socket.on('controller_change', (data: unknown) => {
    if (typeof data == 'object' && data !== null) {
        if (Object.hasOwn(data, 'id') && Object.hasOwn(data, 'payload')) {
            const obj = data as {
                id: unknown;
                payload: unknown;
            }

            const controller = Controller.controllers.get(Number(obj.id));
            if (!controller) return;

            const { type } = controller;
            if (typeof obj.payload === type) {
                controller._value = obj.payload as ControllerValue<typeof type>;
            }
        }
    }
});