import { call } from '../utils/tauri';

export class Controller<T> {


    constructor(public readonly id: number, value: T) {}
}