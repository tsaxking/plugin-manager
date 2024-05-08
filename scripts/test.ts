import assert from 'assert';
import test from 'test';
import { Rack } from '../app/src/model/state';
import { Processors } from '../app/src/model/items/processors';
import { Random } from '../app/src/utils/math';

test('Build Rack Model', () => {
    const rack = new Rack();
    const id = Random.uuid;
    {
        const output = Processors.audioOutput(rack, id(), 'Audio Output', [
            'left',
            'right',
        ]);

        const source = Processors.audioSource(rack, id(), 'Audio Source', [
            'left',
            'right',
        ]);

        const compressor = Processors.compressor(
            rack,
            id(),
            'Compressor',
            true
        );

        Processors.delay(rack, id(), 'Delay', true);

        Processors.duplicator(rack, id(), 'Duplicator', 'audio');

        Processors.eq(rack, id(), 'Envelope', true);

        Processors.filter(rack, id(), 'Filter', true);

        Processors.gain(rack, id(), 'Gain', true);

        Processors.instrument(
            rack,
            id(),
            'Instrument',
            ['MIDI In'],
            ['MIDI Out']
        );

        Processors.lfo(rack, id(), 'LFO');

        Processors.limiter(rack, id(), 'Limiter', true);

        const controller = Processors.midiController(
            rack,
            id(),
            'Midi Controller',
            ['MIDI In'],
            ['Control Out']
        );

        const oscillator = Processors.oscillator(rack, id(), 'Oscillator', [
            'Volume',
            'Frequency',
        ]);

        Processors.plugin(rack, id(), 'Plugin', {
            audio: {
                inputs: ['left', 'right'],
                outputs: ['left', 'right'],
            },
            midi: {
                inputs: ['MIDI In'],
                outputs: ['MIDI Out'],
            },
            control: {
                inputs: ['Control In'],
                outputs: ['Control Out'],
            },
        });

        Processors.random(rack, id(), 'Random');

        const reverb = Processors.reverb(rack, id(), 'Reverb', true);

        Processors.sequencer(
            rack,
            id(),
            'Sequencer',
            ['MIDI In'],
            ['MIDI Out']
        );

        oscillator.moveTo(22, 1);
        controller.moveTo(9, 1);

        source.io.audio.outputs[0].connect(compressor.io.audio.inputs[0]);
        compressor.io.audio.outputs[0].connect(reverb.io.audio.inputs[0]);
        reverb.io.audio.outputs[0].connect(output.io.audio.inputs[0]);
    }

    const str = rack.serialize();
    const rack2 = new Rack();
    rack2.deserialize(str);

    assert.deepStrictEqual(rack, rack2);
});
