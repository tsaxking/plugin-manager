import { RackItem } from "../../rack-item";

export class Gate extends RackItem {
    constructor(
        name: string,
        id: string
    ) {
        super(
            RackItem.getAvailablePoint(),
            8,
            'dark',
            'Gate',
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