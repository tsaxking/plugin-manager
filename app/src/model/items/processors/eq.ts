import { RackItem } from "../../rack-item";

export class EQ extends RackItem {
    constructor(
        id: string,
        name: string,
    ) {
        super(
            RackItem.getAvailablePoint(),
            8,
            'warning',
            'Compressor',
            {
                audio: [['L / Mono', 'R'], ['L / Mono', 'R']],
                midi: [[], []],
                control: [[], []]
            },
            name,
            id
        );
    }
}