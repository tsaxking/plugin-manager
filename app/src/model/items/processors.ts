import { io } from "../io";
import { RackItem } from "../rack-item";
import { Rack } from "../state";

export class Processors {
// ▄▀▄ █ █ █▀▄ █ ▄▀▄ 
// █▀█ ▀▄█ █▄▀ █ ▀▄▀ 
    public static audioOutput(rack: Rack, id: string, name: string, inputs: string[]) {
        return new RackItem(
            rack,
            id,
            name,
            rack.getAvailablePoint(),
            8,
            'dark',
            'Audio Output',
            {
                audio: [inputs, []],
                midi: [[], []],
                control: [[], []]
            }
        )
    }

    public static audioSource(rack: Rack,id: string, name: string, outputs: string[]) {
        return new RackItem(
            rack,
            id,
            name,
            rack.getAvailablePoint(),
            8,
            'dark',
            'Audio Source',
            {
                audio: [[], outputs],
                midi: [[], []],
                control: [[], []]
            },
        )
    }

    public static compressor(rack: Rack,id: string, name: string, stereo = false) {
        return new RackItem(
            rack,
            id,
            name,
            rack.getAvailablePoint(),
            8,
            'primary',
            'Compressor',
            {
                audio: stereo ? [['L', 'R'], ['L', 'R']] : [['In'], ['Out']],
                midi: [[], []],
                control: [[], []]
            },
        )
    }

    public static eq(rack: Rack,id: string, name: string, stereo = false) {
        return new RackItem(
            rack,
            id,
            name,
            rack.getAvailablePoint(),
            8,
            'primary',
            'EQ',
            {
                audio: stereo ? [['L', 'R'], ['L', 'R']] : [['In'], ['Out']],
                midi: [[], []],
                control: [[], []]
            },
        )
    }

    public static gain(rack: Rack,id: string, name: string, stereo = false) {
        return new RackItem(
            rack,
            id,
            name,
            rack.getAvailablePoint(),
            8,
            'primary',
            'Gain',
            {
                audio: stereo ? [['L', 'R'], ['L', 'R']] : [['In'], ['Out']],
                midi: [[], []],
                control: [[], []]
            },
        )
    }

    public static gate(rack: Rack,id: string, name: string, stereo = false) {
        return new RackItem(
            rack,
            id,
            name,
            rack.getAvailablePoint(),
            8,
            'primary',
            'Gate',
            {
                audio: stereo ? [['L', 'R'], ['L', 'R']] : [['In'], ['Out']],
                midi: [[], []],
                control: [[], []]
            },
        )
    }

    public static limiter(rack: Rack,id: string, name: string, stereo = false) {
        return new RackItem(
            rack,
            id,
            name,
            rack.getAvailablePoint(),
            8,
            'primary',
            'Limiter',
            {
                audio: stereo ? [['L', 'R'], ['L', 'R']] : [['In'], ['Out']],
                midi: [[], []],
                control: [[], []]
            },
        )
    }   

    public static reverb(rack: Rack,id: string, name: string, stereo = false) {
        return new RackItem(
            rack,
            id,
            name,
            rack.getAvailablePoint(),
            8,
            'primary',
            'Reverb',
            {
                audio: stereo ? [['L', 'R'], ['L', 'R']] : [['In'], ['Out']],
                midi: [[], []],
                control: [[], []]
            },
        )
    }

    public static delay(rack: Rack,id: string, name: string, stereo = false) {
        return new RackItem(
            rack,
            id,
            name,
            rack.getAvailablePoint(),
            8,
            'primary',
            'Delay',
            {
                audio: stereo ? [['L', 'R'], ['L', 'R']] : [['In'], ['Out']],
                midi: [[], []],
                control: [[], []]
            },
        )
    }

    public static filter(rack: Rack,id: string, name: string, stereo = false) {
        return new RackItem(
            rack,
            id,
            name,
            rack.getAvailablePoint(),
            8,
            'primary',
            'Filter',
            {
                audio: stereo ? [['L', 'R'], ['L', 'R']] : [['In'], ['Out']],
                midi: [[], []],
                control: [[], []]
            },
        )
    }

// █▄ ▄█ █ █▀▄ █ 
// █ ▀ █ █ █▄▀ █ 

    public static instrument(rack: Rack,id: string, name: string, inputs: string[], outputs: string[]) {
        return new RackItem(
            rack,
            id,
            name,
            rack.getAvailablePoint(),
            8,
            'success',
            'Instrument',
            {
                audio: [[], []],
                midi: [inputs, outputs],
                control: [[], []]
            },
        )
    }

    public static oscillator(rack: Rack,id: string, name: string, inputs: string[]) {
        return new RackItem(
            rack,
            id,
            name,
            rack.getAvailablePoint(),
            8,
            'warning',
            'Oscillator',
            {
                audio: [[], ['Out']],
                midi: [[], []],
                control: [inputs, []]
            },
        )
    }

    public static sequencer(rack: Rack,id: string, name: string, inputs: string[], outputs: string[]) {
        return new RackItem(
            rack,
            id,
            name,
            rack.getAvailablePoint(),
            8,
            'info',
            'Sequencer',
            {
                audio: [[], []],
                midi: [inputs, outputs],
                control: [[], []]
            },
        )
    }

    public static plugin(rack: Rack,id: string, name: string, io: io) {
        return new RackItem(
            rack,
            id,
            name,
            rack.getAvailablePoint(),
            8,
            'dark',
            'Plugin',
            io,
        )
    }



// ▄▀▀ ▄▀▄ █▄ █ ▀█▀ █▀▄ ▄▀▄ █   
// ▀▄▄ ▀▄▀ █ ▀█  █  █▀▄ ▀▄▀ █▄▄ 

    public static midiController(rack: Rack,id: string, name: string, inputs: string[], outputs: string[]) {
        return new RackItem(
            rack,
            id,
            name,
            rack.getAvailablePoint(),
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

    public static random(rack: Rack,id: string, name: string) {
        return new RackItem(
            rack,
            id,
            name,
            rack.getAvailablePoint(),
            8,
            'danger',
            'Random',
            {
                audio: [[], []],
                midi: [['In'], []],
                control: [[], ['Random']]
            },
        )
    }

    public static lfo(rack: Rack,id: string, name: string) {
        return new RackItem(
            rack,
            id,
            name,
            rack.getAvailablePoint(),
            8,
            'danger',
            'LFO',
            {
                audio: [[], []],
                midi: [[], []],
                control: [[], ['LFO']]
            },
        )
    }
}