import assert from 'assert';
import test from 'test';
import { Rack } from '../app/src/model/state';
import { Processors } from '../app/src/model/items/processors';
import { Random } from '../app/src/utils/math';
import { capitalize, toCamelCase, toSnakeCase, fromCamelCase,fromSnakeCase, abbreviate, toByteString, cost, fmtNumber } from '../app/src/utils/text';
import { time, time24, date, dateTime, fullDate, fullDateTime, fullDateTime24 } from '../app/src/utils/clock';

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

test('Text', () => {
    assert.strictEqual(capitalize('hello world'), 'Hello World');
    assert.strictEqual(toCamelCase('hello world'), 'helloWorld');
    assert.strictEqual(toSnakeCase('hello world'), 'hello_world');
    assert.strictEqual(fromCamelCase('helloWorld'), 'hello world');
    assert.strictEqual(fromSnakeCase('hello_world'), 'hello world');
    assert.strictEqual(abbreviate('hello world', 5), 'he...');
    assert.strictEqual(toByteString(1024), '1.00 KB');
    assert.strictEqual(cost(1000), '$1,000.00');
    assert.strictEqual(fmtNumber(1000), '1,000');
    assert.strictEqual(fmtNumber(1000.12), '1,000.12');
});

test('Date', () => {
    const d = new Date('2021-01-01T00:00:00Z');

    assert.strictEqual(time(d), '12:00 AM');
    assert.strictEqual(time24(d), '00:00');
    assert.strictEqual(date(d), '01/01/2021');
    assert.strictEqual(dateTime(d), '01/01/2021 12:00 AM');
    assert.strictEqual(fullDate(d), 'January 1, 2021');
    assert.strictEqual(fullDateTime(d), 'January 1, 2021 12:00 AM');
    assert.strictEqual(fullDateTime24(d), 'January 1, 2021 00:00');
});