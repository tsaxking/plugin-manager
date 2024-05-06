import { RackItem } from "../../rack-item";


export class Gain extends RackItem {
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
            'Gain',
            {
                audio: [['In'], ['Out']],
                midi: [[], []],
                control: [[], []]
            },
        );
    }
}