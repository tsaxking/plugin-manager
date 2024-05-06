import { RackItem } from "../../rack-item";

export class AudioSource extends RackItem {
    constructor(
        id: string,
        name: string,
        outputs: string[],
    ) {
        super(
            RackItem.getAvailablePoint(),
            8,
            'light',
            'Audio Source',
            {
                audio: [[], outputs],
                midi: [[], []],
                control: [[], []]
            },
            name,
            id
        );
    }
}