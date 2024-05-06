import { RackItem } from "../../rack-item";

export class AudioOutput extends RackItem {
    constructor(
        id: string,
        name: string,
        inputs: string[],
    ) {
        super(
            RackItem.getAvailablePoint(),
            8,
            'dark',
            'Audio Output',
            {
                audio: [inputs, []],
                midi: [[], []],
                control: [[], []]
            },
            name,
            id
        );
    }
}