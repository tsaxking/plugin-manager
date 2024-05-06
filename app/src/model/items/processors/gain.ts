import { RackItem } from "../../rack-item";


export class Gain extends RackItem {
    constructor(
        name: string,
        id: string
    ) {
        super(
            RackItem.getAvailablePoint(),
            8,
            'dark',
            'Gain',
            {
                audio: [['In'], ['Out']],
                midi: [[], []],
                control: [[], []]
            },
            name,
            id
        );
    }
}