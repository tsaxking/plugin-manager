import { RackItem } from '../rack-item';
import { Rack } from '../state';
import { Random } from '../../utils/math';
import { ioObject } from '../io';

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
        return new RackItem(rack, {
            type: 'audio-output',
            metadata: {
                id: getId(id, 'audio-output'),
                note: name,
                point: rack.getAvailablePoint(),
                width: 8,
                color: 'primary',
            },
            audio: {
                inputs: inputs.map(i => ({ name: i, state: 'Disconnected' })),
                outputs: [],
            },
        });
    }

    public static audioSource(
        rack: Rack,
        id: string,
        name: string,
        outputs: string[]
    ) {
        return new RackItem(rack, {
            type: 'audio-source',
            metadata: {
                id: getId(id, 'audio-source'),
                note: name,
                point: rack.getAvailablePoint(),
                width: 8,
                color: 'primary',
            },
            audio: {
                inputs: [],
                outputs: outputs.map(o => ({ name: o, state: 'Disconnected' })),
            },
        });
    }

    public static compressor(
        rack: Rack,
        id: string,
        name: string,
        stereo = false
    ) {
        return new RackItem(rack, {
            type: 'compressor',
            metadata: {
                id: getId(id, 'compressor'),
                note: name,
                point: rack.getAvailablePoint(),
                width: 8,
                color: 'primary',
            },
            audio: {
                inputs: stereo
                    ? [
                          {
                              name: 'L',
                              state: 'Disconnected',
                          },
                          {
                              name: 'R',
                              state: 'Disconnected',
                          },
                      ]
                    : [
                          {
                              name: 'In',
                              state: 'Disconnected',
                          },
                      ],
                outputs: stereo
                    ? [
                          {
                              name: 'L',
                              state: 'Disconnected',
                          },
                          {
                              name: 'R',
                              state: 'Disconnected',
                          },
                      ]
                    : [
                          {
                              name: 'Out',
                              state: 'Disconnected',
                          },
                      ],
            },
            midi: {
                inputs: [],
                outputs: [],
            },
            control: {
                inputs: [],
                outputs: [],
            },
        });
    }

    public static eq(rack: Rack, id: string, name: string, stereo = false) {
        return new RackItem(rack, {
            type: 'eq',
            metadata: {
                id: getId(id, 'eq'),
                note: name,
                point: rack.getAvailablePoint(),
                width: 8,
                color: 'primary',
            },
            audio: {
                inputs: stereo
                    ? [
                          {
                              name: 'L',
                              state: 'Disconnected',
                          },
                          {
                              name: 'R',
                              state: 'Disconnected',
                          },
                      ]
                    : [
                          {
                              name: 'In',
                              state: 'Disconnected',
                          },
                      ],
                outputs: stereo
                    ? [
                          {
                              name: 'L',
                              state: 'Disconnected',
                          },
                          {
                              name: 'R',
                              state: 'Disconnected',
                          },
                      ]
                    : [
                          {
                              name: 'Out',
                              state: 'Disconnected',
                          },
                      ],
            },
            midi: {
                inputs: [],
                outputs: [],
            },
            control: {
                inputs: [],
                outputs: [],
            },
        });
    }

    public static gain(rack: Rack, id: string, name: string, stereo = false) {
        return new RackItem(rack, {
            type: 'gain',
            metadata: {
                id: getId(id, 'gain'),
                note: name,
                point: rack.getAvailablePoint(),
                width: 8,
                color: 'primary',
            },
            audio: {
                inputs: stereo
                    ? [
                          {
                              name: 'L',
                              state: 'Disconnected',
                          },
                          {
                              name: 'R',
                              state: 'Disconnected',
                          },
                      ]
                    : [
                          {
                              name: 'In',
                              state: 'Disconnected',
                          },
                      ],
                outputs: stereo
                    ? [
                          {
                              name: 'L',
                              state: 'Disconnected',
                          },
                          {
                              name: 'R',
                              state: 'Disconnected',
                          },
                      ]
                    : [
                          {
                              name: 'Out',
                              state: 'Disconnected',
                          },
                      ],
            },
            midi: {
                inputs: [],
                outputs: [],
            },
            control: {
                inputs: [],
                outputs: [],
            },
        });
    }

    public static gate(rack: Rack, id: string, name: string, stereo = false) {
        return new RackItem(rack, {
            type: 'gate',
            metadata: {
                id: getId(id, 'gate'),
                note: name,
                point: rack.getAvailablePoint(),
                width: 8,
                color: 'primary',
            },
            audio: {
                inputs: stereo
                    ? [
                          {
                              name: 'L',
                              state: 'Disconnected',
                          },
                          {
                              name: 'R',
                              state: 'Disconnected',
                          },
                      ]
                    : [
                          {
                              name: 'In',
                              state: 'Disconnected',
                          },
                      ],
                outputs: stereo
                    ? [
                          {
                              name: 'L',
                              state: 'Disconnected',
                          },
                          {
                              name: 'R',
                              state: 'Disconnected',
                          },
                      ]
                    : [
                          {
                              name: 'Out',
                              state: 'Disconnected',
                          },
                      ],
            },
            midi: {
                inputs: [],
                outputs: [],
            },
            control: {
                inputs: [],
                outputs: [],
            },
        });
    }

    public static limiter(
        rack: Rack,
        id: string,
        name: string,
        stereo = false
    ) {
        return new RackItem(rack, {
            type: 'limiter',
            metadata: {
                id: getId(id, 'limiter'),
                note: name,
                point: rack.getAvailablePoint(),
                width: 8,
                color: 'primary',
            },
            audio: {
                inputs: stereo
                    ? [
                          {
                              name: 'L',
                              state: 'Disconnected',
                          },
                          {
                              name: 'R',
                              state: 'Disconnected',
                          },
                      ]
                    : [
                          {
                              name: 'In',
                              state: 'Disconnected',
                          },
                      ],
                outputs: stereo
                    ? [
                          {
                              name: 'L',
                              state: 'Disconnected',
                          },
                          {
                              name: 'R',
                              state: 'Disconnected',
                          },
                      ]
                    : [
                          {
                              name: 'Out',
                              state: 'Disconnected',
                          },
                      ],
            },
            midi: {
                inputs: [],
                outputs: [],
            },
            control: {
                inputs: [],
                outputs: [],
            },
        });
    }

    public static reverb(rack: Rack, id: string, name: string, stereo = false) {
        return new RackItem(rack, {
            type: 'reverb',
            metadata: {
                id: getId(id, 'reverb'),
                note: name,
                point: rack.getAvailablePoint(),
                width: 8,
                color: 'primary',
            },
            audio: {
                inputs: stereo
                    ? [
                          {
                              name: 'L',
                              state: 'Disconnected',
                          },
                          {
                              name: 'R',
                              state: 'Disconnected',
                          },
                      ]
                    : [
                          {
                              name: 'In',
                              state: 'Disconnected',
                          },
                      ],
                outputs: stereo
                    ? [
                          {
                              name: 'L',
                              state: 'Disconnected',
                          },
                          {
                              name: 'R',
                              state: 'Disconnected',
                          },
                      ]
                    : [
                          {
                              name: 'Out',
                              state: 'Disconnected',
                          },
                      ],
            },
            midi: {
                inputs: [],
                outputs: [],
            },
            control: {
                inputs: [],
                outputs: [],
            },
        });
    }

    public static delay(rack: Rack, id: string, name: string, stereo = false) {
        return new RackItem(rack, {
            type: 'delay',
            metadata: {
                id: getId(id, 'delay'),
                note: name,
                point: rack.getAvailablePoint(),
                width: 8,
                color: 'primary',
            },
            audio: {
                inputs: stereo
                    ? [
                          {
                              name: 'L',
                              state: 'Disconnected',
                          },
                          {
                              name: 'R',
                              state: 'Disconnected',
                          },
                      ]
                    : [
                          {
                              name: 'In',
                              state: 'Disconnected',
                          },
                      ],
                outputs: stereo
                    ? [
                          {
                              name: 'L',
                              state: 'Disconnected',
                          },
                          {
                              name: 'R',
                              state: 'Disconnected',
                          },
                      ]
                    : [
                          {
                              name: 'Out',
                              state: 'Disconnected',
                          },
                      ],
            },
            midi: {
                inputs: [],
                outputs: [],
            },
            control: {
                inputs: [],
                outputs: [],
            },
        });
    }

    public static filter(rack: Rack, id: string, name: string, stereo = false) {
        return new RackItem(rack, {
            type: 'filter',
            metadata: {
                id: getId(id, 'filter'),
                note: name,
                point: rack.getAvailablePoint(),
                width: 8,
                color: 'primary',
            },
            audio: {
                inputs: stereo
                    ? [
                          {
                              name: 'L',
                              state: 'Disconnected',
                          },
                          {
                              name: 'R',
                              state: 'Disconnected',
                          },
                      ]
                    : [
                          {
                              name: 'In',
                              state: 'Disconnected',
                          },
                      ],
                outputs: stereo
                    ? [
                          {
                              name: 'L',
                              state: 'Disconnected',
                          },
                          {
                              name: 'R',
                              state: 'Disconnected',
                          },
                      ]
                    : [
                          {
                              name: 'Out',
                              state: 'Disconnected',
                          },
                      ],
            },
            midi: {
                inputs: [],
                outputs: [],
            },
            control: {
                inputs: [],
                outputs: [],
            },
        });
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
        return new RackItem(rack, {
            type: 'instrument',
            metadata: {
                id: getId(id, 'instrument'),
                note: name,
                point: rack.getAvailablePoint(),
                width: 8,
                color: 'warning',
            },
            midi: {
                inputs: inputs.map(i => ({ name: i, state: 'Disconnected' })),
                outputs: outputs.map(o => ({ name: o, state: 'Disconnected' })),
            },
        });
    }

    public static oscillator(
        rack: Rack,
        id: string,
        name: string,
        inputs: string[]
    ) {
        return new RackItem(rack, {
            type: 'oscillator',
            metadata: {
                id: getId(id, 'oscillator'),
                note: name,
                point: rack.getAvailablePoint(),
                width: 8,
                color: 'warning',
            },
            audio: {
                inputs: [],
                outputs: inputs.map(i => ({ name: i, state: 'Disconnected' })),
            },
            midi: {
                inputs: inputs.map(i => ({ name: i, state: 'Disconnected' })),
                outputs: [],
            },
        });
    }

    public static sequencer(
        rack: Rack,
        id: string,
        name: string,
        inputs: string[],
        outputs: string[]
    ) {
        return new RackItem(rack, {
            type: 'sequencer',
            metadata: {
                id: getId(id, 'sequencer'),
                note: name,
                point: rack.getAvailablePoint(),
                width: 8,
                color: 'warning',
            },
            midi: {
                inputs: inputs.map(i => ({ name: i, state: 'Disconnected' })),
                outputs: outputs.map(o => ({ name: o, state: 'Disconnected' })),
            },
        });
    }

    public static plugin(rack: Rack, id: string, name: string, io: ioObject) {
        return new RackItem(rack, {
            type: 'plugin',
            metadata: {
                id: getId(id, 'plugin'),
                note: name,
                point: rack.getAvailablePoint(),
                width: 8,
                color: 'warning',
            },
            audio: io.audio
                ? {
                      inputs: io.audio.inputs,
                      outputs: io.audio.outputs,
                  }
                : undefined,
            midi: io.midi
                ? {
                      inputs: io.midi.inputs,
                      outputs: io.midi.outputs,
                  }
                : undefined,
            control: io.control
                ? {
                      inputs: io.control.inputs,
                      outputs: io.control.outputs,
                  }
                : undefined,
        });
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
        return new RackItem(rack, {
            type: 'midi-controller',
            metadata: {
                id: getId(id, 'midi-controller'),
                note: name,
                point: rack.getAvailablePoint(),
                width: 8,
                color: 'success',
            },
            midi: {
                inputs: inputs.map(i => ({ name: i, state: 'Disconnected' })),
                outputs: [],
            },
            control: {
                inputs: [],
                outputs: outputs.map(o => ({ name: o, state: 'Disconnected' })),
            },
        });
    }

    public static random(rack: Rack, id: string, name: string) {
        return new RackItem(rack, {
            type: 'random',
            metadata: {
                id: getId(id, 'random'),
                note: name,
                point: rack.getAvailablePoint(),
                width: 8,
                color: 'success',
            },
            control: {
                inputs: [],
                outputs: [
                    {
                        name: 'Out',
                        state: 'Disconnected',
                    },
                ],
            },
        });
    }

    public static lfo(rack: Rack, id: string, name: string) {
        return new RackItem(rack, {
            type: 'lfo',
            metadata: {
                id: getId(id, 'lfo'),
                note: name,
                point: rack.getAvailablePoint(),
                width: 8,
                color: 'success',
            },
            control: {
                inputs: [],
                outputs: [
                    {
                        name: 'Out',
                        state: 'Disconnected',
                    },
                ],
            },
        });
    }

    public static duplicator(
        rack: Rack,
        id: string,
        name: string,
        type: 'audio' | 'midi' | 'controller'
    ) {
        return new RackItem(rack, {
            type: 'duplicator',
            metadata: {
                id: getId(id, 'duplicator'),
                note: name,
                point: rack.getAvailablePoint(),
                width: 8,
                color: 'success',
            },
            audio:
                type === 'audio'
                    ? {
                          inputs: [
                              {
                                  name: 'In',
                                  state: 'Disconnected',
                              },
                          ],
                          outputs: [
                              {
                                  name: 'Out1',
                                  state: 'Disconnected',
                              },
                              {
                                  name: 'Out2',
                                  state: 'Disconnected',
                              },
                          ],
                      }
                    : undefined,
            midi:
                type === 'midi'
                    ? {
                          inputs: [
                              {
                                  name: 'In',
                                  state: 'Disconnected',
                              },
                          ],
                          outputs: [
                              {
                                  name: 'Out1',
                                  state: 'Disconnected',
                              },
                              {
                                  name: 'Out2',
                                  state: 'Disconnected',
                              },
                          ],
                      }
                    : undefined,
            control:
                type === 'controller'
                    ? {
                          inputs: [
                              {
                                  name: 'In',
                                  state: 'Disconnected',
                              },
                          ],
                          outputs: [
                              {
                                  name: 'Out1',
                                  state: 'Disconnected',
                              },
                              {
                                  name: 'Out2',
                                  state: 'Disconnected',
                              },
                          ],
                      }
                    : undefined,
        });
    }
}
