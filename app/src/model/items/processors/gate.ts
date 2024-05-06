import { RackItem } from "../../rack-item";

export class Gate extends RackItem {
    constructor(
        name: string,
        id: string
    ) {
        super(
            id,
            
            name,
            RackItem.getAvailablePoint(),
            8,
            'dark',
            'Gate',
            {
                audio: [['L / Mono', 'R'], ['L / Mono', 'R']],
                midi: [[], []],
                control: [[], []]
            },
        );
    }
}