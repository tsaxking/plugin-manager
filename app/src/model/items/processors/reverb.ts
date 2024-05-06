import { RackItem } from "../../rack-item";


export class Reverb extends RackItem {
    constructor(
        id: string,
        name: string
    ) {
        super(
            RackItem.getAvailablePoint(),
            8,
            'dark',
            'Reverb',
            {
                audio: [['L / Mono', 'R'], ['L', 'R']],
                midi: [[], []],
                control: [[], []]
            },
            name,
            id
        );
    }
}