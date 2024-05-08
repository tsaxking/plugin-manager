import { io } from '../io';
import { RackItem } from '../rack-item';
import { Rack } from '../state';
import { Random } from '../../utils/math';

const getId = (id: string, name: string) => id + ':' + name.toLowerCase();

export class Processors {
    // ▄▀▄ █ █ █▀▄ █ ▄▀▄
    // █▀█ ▀▄█ █▄▀ █ ▀▄▀
    public static audioOutput(
        rack: Rack,
        id: string,
        name: string,
        inputs: string[]
    ) {
        return new RackItem(
            rack,
            getId(id, 'audio-output'),
            name,
            rack.getAvailablePoint(),
            8,
            'dark',
            'Audio Output',
            {
                audio: {
                    inputs,
                    outputs: [],
                },
                midi: {
                    inputs: [],
                    outputs: [],
                },
                control: {
                    inputs: [],
                    outputs: [],
                },
            }
        );
    }

    public static audioSource(
        rack: Rack,
        id: string,
        name: string,
        outputs: string[]
    ) {
        return new RackItem(
            rack,
            getId(id, 'audio-source'),
            name,
            rack.getAvailablePoint(),
            8,
            'dark',
            'Audio Source',
            {
                audio: {
                    inputs: [],
                    outputs,
                },
                midi: {
                    inputs: [],
                    outputs: [],
                },
                control: {
                    inputs: [],
                    outputs: [],
                },
            }
        );
    }

    public static compressor(
        rack: Rack,
        id: string,
        name: string,
        stereo = false
    ) {
        return new RackItem(
            rack,
            getId(id, 'compressor'),
            name,
            rack.getAvailablePoint(),
            8,
            'primary',
            'Compressor',
            {
                audio: {
                    inputs: stereo ? ['L', 'R'] : ['In'],
                    outputs: stereo ? ['L', 'R'] : ['Out'],
                },
                midi: {
                    inputs: [],
                    outputs: [],
                },
                control: {
                    inputs: [],
                    outputs: [],
                },
            }
        );
    }

    public static eq(rack: Rack, id: string, name: string, stereo = false) {
        return new RackItem(
            rack,
            getId(id, 'eq'),
            name,
            rack.getAvailablePoint(),
            8,
            'primary',
            'EQ',
            {
                audio: {
                    inputs: stereo ? ['L', 'R'] : ['In'],
                    outputs: stereo ? ['L', 'R'] : ['Out'],
                },
                midi: {
                    inputs: [],
                    outputs: [],
                },
                control: {
                    inputs: [],
                    outputs: [],
                },
            }
        );
    }

    public static gain(rack: Rack, id: string, name: string, stereo = false) {
        return new RackItem(
            rack,
            getId(id, 'gain'),
            name,
            rack.getAvailablePoint(),
            8,
            'primary',
            'Gain',
            {
                audio: {
                    inputs: stereo ? ['L', 'R'] : ['In'],
                    outputs: stereo ? ['L', 'R'] : ['Out'],
                },
                midi: {
                    inputs: [],
                    outputs: [],
                },
                control: {
                    inputs: [],
                    outputs: [],
                },
            }
        );
    }

    public static gate(rack: Rack, id: string, name: string, stereo = false) {
        return new RackItem(
            rack,
            getId(id, 'gate'),
            name,
            rack.getAvailablePoint(),
            8,
            'primary',
            'Gate',
            {
                audio: {
                    inputs: stereo ? ['L', 'R'] : ['In'],
                    outputs: stereo ? ['L', 'R'] : ['Out'],
                },
                midi: {
                    inputs: [],
                    outputs: [],
                },
                control: {
                    inputs: [],
                    outputs: [],
                },
            }
        );
    }

    public static limiter(
        rack: Rack,
        id: string,
        name: string,
        stereo = false
    ) {
        return new RackItem(
            rack,
            getId(id, 'limiter'),
            name,
            rack.getAvailablePoint(),
            8,
            'primary',
            'Limiter',
            {
                audio: {
                    inputs: stereo ? ['L', 'R'] : ['In'],
                    outputs: stereo ? ['L', 'R'] : ['Out'],
                },
                midi: {
                    inputs: [],
                    outputs: [],
                },
                control: {
                    inputs: [],
                    outputs: [],
                },
            }
        );
    }

    public static reverb(rack: Rack, id: string, name: string, stereo = false) {
        return new RackItem(
            rack,
            getId(id, 'reverb'),
            name,
            rack.getAvailablePoint(),
            8,
            'primary',
            'Reverb',
            {
                audio: {
                    inputs: stereo ? ['L', 'R'] : ['In'],
                    outputs: stereo ? ['L', 'R'] : ['Out'],
                },
                midi: {
                    inputs: [],
                    outputs: [],
                },
                control: {
                    inputs: [],
                    outputs: [],
                },
            }
        );
    }

    public static delay(rack: Rack, id: string, name: string, stereo = false) {
        return new RackItem(
            rack,
            getId(id, 'delay'),
            name,
            rack.getAvailablePoint(),
            8,
            'primary',
            'Delay',
            {
                audio: {
                    inputs: stereo ? ['L', 'R'] : ['In'],
                    outputs: stereo ? ['L', 'R'] : ['Out'],
                },
                midi: {
                    inputs: [],
                    outputs: [],
                },
                control: {
                    inputs: [],
                    outputs: [],
                },
            }
        );
    }

    public static filter(rack: Rack, id: string, name: string, stereo = false) {
        return new RackItem(
            rack,
            getId(id, 'filter'),
            name,
            rack.getAvailablePoint(),
            8,
            'primary',
            'Filter',
            {
                audio: {
                    inputs: stereo ? ['L', 'R'] : ['In'],
                    outputs: stereo ? ['L', 'R'] : ['Out'],
                },
                midi: {
                    inputs: [],
                    outputs: [],
                },
                control: {
                    inputs: [],
                    outputs: [],
                },
            }
        );
    }

    // █▄ ▄█ █ █▀▄ █
    // █ ▀ █ █ █▄▀ █

    public static instrument(
        rack: Rack,
        id: string,
        name: string,
        inputs: string[],
        outputs: string[]
    ) {
        return new RackItem(
            rack,
            getId(id, 'instrument'),
            name,
            rack.getAvailablePoint(),
            8,
            'success',
            'Instrument',
            {
                audio: {
                    inputs: [],
                    outputs: [],
                },
                midi: {
                    inputs,
                    outputs,
                },
                control: {
                    inputs: [],
                    outputs: [],
                },
            }
        );
    }

    public static oscillator(
        rack: Rack,
        id: string,
        name: string,
        inputs: string[]
    ) {
        return new RackItem(
            rack,
            getId(id, 'oscillator'),
            name,
            rack.getAvailablePoint(),
            8,
            'warning',
            'Oscillator',
            {
                audio: {
                    inputs: [],
                    outputs: ['Out'],
                },
                midi: {
                    inputs: [],
                    outputs: [],
                },
                control: {
                    inputs,
                    outputs: [],
                },
            }
        );
    }

    public static sequencer(
        rack: Rack,
        id: string,
        name: string,
        inputs: string[],
        outputs: string[]
    ) {
        return new RackItem(
            rack,
            getId(id, 'sequencer'),
            name,
            rack.getAvailablePoint(),
            8,
            'info',
            'Sequencer',
            {
                audio: {
                    inputs: [],
                    outputs: [],
                },
                midi: {
                    inputs,
                    outputs,
                },
                control: {
                    inputs: [],
                    outputs: [],
                },
            }
        );
    }

    public static plugin(rack: Rack, id: string, name: string, io: io) {
        return new RackItem(
            rack,
            getId(id, 'plugin'),
            name,
            rack.getAvailablePoint(),
            8,
            'dark',
            'Plugin',
            io
        );
    }

    // ▄▀▀ ▄▀▄ █▄ █ ▀█▀ █▀▄ ▄▀▄ █
    // ▀▄▄ ▀▄▀ █ ▀█  █  █▀▄ ▀▄▀ █▄▄

    public static midiController(
        rack: Rack,
        id: string,
        name: string,
        inputs: string[],
        outputs: string[]
    ) {
        return new RackItem(
            rack,
            getId(id, 'midi-controller'),
            name,
            rack.getAvailablePoint(),
            8,
            'danger',
            'MIDI Controller',
            {
                audio: {
                    inputs: [],
                    outputs: [],
                },
                midi: {
                    inputs,
                    outputs: [],
                },
                control: {
                    inputs: [],
                    outputs,
                },
            }
        );
    }

    public static random(rack: Rack, id: string, name: string) {
        return new RackItem(
            rack,
            getId(id, 'random'),
            name,
            rack.getAvailablePoint(),
            8,
            'danger',
            'Random',
            {
                audio: {
                    inputs: [],
                    outputs: [],
                },
                midi: {
                    inputs: ['In'],
                    outputs: [],
                },
                control: {
                    inputs: [],
                    outputs: ['Random'],
                },
            }
        );
    }

    public static lfo(rack: Rack, id: string, name: string) {
        return new RackItem(
            rack,
            getId(id, 'lfo'),
            name,
            rack.getAvailablePoint(),
            8,
            'danger',
            'LFO',
            {
                audio: {
                    inputs: [],
                    outputs: [],
                },
                midi: {
                    inputs: [],
                    outputs: [],
                },
                control: {
                    inputs: [],
                    outputs: ['LFO'],
                },
            }
        );
    }

    public static duplicator(
        rack: Rack,
        id: string,
        name: string,
        type: 'audio' | 'midi' | 'controller'
    ) {
        return new RackItem(
            rack,
            getId(id, 'duplicator'),
            name,
            rack.getAvailablePoint(),
            8,
            'danger',
            'Duplicator',
            {
                audio:
                    type === 'audio'
                        ? {
                              inputs: ['In'],
                              outputs: ['1', '2'],
                          }
                        : {
                              inputs: [],
                              outputs: [],
                          },
                midi:
                    type === 'midi'
                        ? {
                              inputs: ['In'],
                              outputs: ['1', '2'],
                          }
                        : {
                              inputs: [],
                              outputs: [],
                          },
                control:
                    type === 'controller'
                        ? {
                              inputs: ['In'],
                              outputs: ['1', '2'],
                          }
                        : {
                              inputs: [],
                              outputs: [],
                          },
            }
        );
    }
}
