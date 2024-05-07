import { RackItem } from "../../rack-item";


export class Compressor extends RackItem {
    constructor(
        id: string,
        name: string,
    ) {
        super(
            id,
            
            name,
            RackItem.getAvailablePoint(),
            8,
            'warning',
            'Compressor',
            {
                audio: [['L / Mono', 'R'], ['L / Mono', 'R']],
                midi: [[], []],
                control: [[], []]
            },
        );
    }
}