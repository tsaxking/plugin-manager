import { RackItem } from "../../rack-item";

export class Instrument extends RackItem {
    constructor(
        id: string,
        name: string,
        inputs: string[],
        outputs: string[],
    ) {
        super(
            RackItem.getAvailablePoint(),
            8,
            'light',
            'MIDI Controller',
            {
                audio: [[], []],
                midi: [inputs, outputs],
                control: [[], []]
            },
            name,
            id
        );
    }
}