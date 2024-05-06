import { RackItem } from "../../rack-item";

export class Oscillator extends RackItem {
    constructor(
        id: string,
        name: string,
        inputs: string[],
    ) {
        super(
            id,
            
            name,
            RackItem.getAvailablePoint(),
            8,
            'success',
            'Oscillator',
            {
                audio: [[], ['Out']],
                midi: [[], []],
                control: [inputs, []]
            },
        )
    }
}