import { RackItem } from "../../rack-item";


export class Controller extends RackItem {
    constructor(
        id: string,
        name: string,
        inputs: string[],
        outputs: string[],
    ) {
        super(
            id,
            
            name,
            RackItem.getAvailablePoint(),
            8,
            'danger',
            'MIDI Controller',
            {
                audio: [[], []],
                midi: [inputs, []],
                control: [[], outputs]
            },
        )
    }
}