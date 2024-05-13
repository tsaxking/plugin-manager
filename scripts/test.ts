import assert from 'assert';
import test from 'test';
import { execSync } from 'child_process';
import { Rack } from '../app/src/model/state';
import { Processors } from '../app/src/model/items/processors';
import { $Math, Random } from '../app/src/utils/math';
import {
    capitalize,
    toCamelCase,
    toSnakeCase,
    fromCamelCase,
    fromSnakeCase,
    abbreviate,
    toByteString,
    cost,
    fmtNumber,
} from '../app/src/utils/text';
import {
    standardDeviation,
    mean,
    median,
    mode,
    range,
} from '../app/src/utils/calcs/statistics';

test('Build Rack Model', () => {
    const rack1 = new Rack();
    const id = Random.uuid;
    {
        const output = Processors.audioOutput(rack1, id(), 'Audio Output', [
            'left',
            'right',
        ]);

        const source = Processors.audioSource(rack1, id(), 'Audio Source', [
            'left',
            'right',
        ]);

        const compressor = Processors.compressor(
            rack1,
            id(),
            'Compressor',
            true
        );

        Processors.delay(rack1, id(), 'Delay', true);

        Processors.duplicator(rack1, id(), 'Duplicator', 'audio');

        Processors.eq(rack1, id(), 'Envelope', true);

        Processors.filter(rack1, id(), 'Filter', true);

        Processors.gain(rack1, id(), 'Gain', true);

        Processors.instrument(
            rack1,
            id(),
            'Instrument',
            ['MIDI In'],
            ['MIDI Out']
        );

        Processors.lfo(rack1, id(), 'LFO');

        Processors.limiter(rack1, id(), 'Limiter', true);

        const controller = Processors.midiController(
            rack1,
            id(),
            'Midi Controller',
            ['MIDI In'],
            ['Control Out']
        );

        const oscillator = Processors.oscillator(rack1, id(), 'Oscillator', [
            'Volume',
            'Frequency',
        ]);

        Processors.plugin(rack1, id(), 'Plugin', {
            audio: {
                inputs: ['left', 'right'].map(i => ({
                    name: i,
                    state: 'Disconnected',
                })),
                outputs: ['left', 'right'].map(i => ({
                    name: i,
                    state: 'Disconnected',
                })),
            },
            midi: {
                inputs: ['MIDI In'].map(i => ({
                    name: i,
                    state: 'Disconnected',
                })),
                outputs: ['MIDI Out'].map(i => ({
                    name: i,
                    state: 'Disconnected',
                })),
            },
            control: {
                inputs: ['Control In'].map(i => ({
                    name: i,
                    state: 'Disconnected',
                })),
                outputs: ['Control Out'].map(i => ({
                    name: i,
                    state: 'Disconnected',
                })),
            },
        });

        Processors.random(rack1, id(), 'Random');

        const reverb = Processors.reverb(rack1, id(), 'Reverb', true);

        Processors.sequencer(
            rack1,
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

    const str1 = rack1.serialize();
    const rack2 = new Rack();
    rack2.deserialize(str1);
    rack2.serialize();

    assert(true); // if no error, then pass
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

test('Math', () => {
    // random
    {
        const arr = new Array(10).fill(0).map(Random.uuid);
        const item = Random.choose(arr);
        assert(arr.includes(item));
        const newArr = Random.shuffle(arr);
        // console.log(arr, newArr);
        assert(
            arr.every(i => newArr.includes(i)) &&
                newArr.every(i => arr.includes(i))
        );

        const n = Random.between(1, 10);
        assert(n >= 1 && n <= 10);
    }

    {
        assert($Math.roundTo(2, 1.2345) === 1.23);
        assert($Math.roundTo(3, 1.2345) === 1.235);

        const arr = [1, 2, 3, 4, 5];
        const result = arr.map($Math.movingAverage(3));
        assert(result.every((v, i) => [1, 1.5, 2, 3, 4][i] === v));

        assert($Math.average(arr) === 3);
        assert($Math.range(5).every((v, i) => v === i));
    }
});

test('Statistics', () => {
    const close = (a: number, b: number) => Math.abs(a - b) < 0.0001;

    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    assert(close(standardDeviation(arr), 2.8722813232690143));
    assert(close(mean(arr), 4.5));
    assert(close(median(arr), 4.5));
    assert(mode(arr) === 0);
    assert(range(arr) === 9);
    // const [a, b, c] = quartiles(arr);
    // assert(a === 2 && b === 4.5 && c === 7);
    // assert(interquartileRange(arr) === 5);
    // assert(outliers(arr).length === 0);
    // assert(close(zScore(arr, 5), 0));
    // assert(close(correlation([1, 2, 3], [3, 2, 1]), -1));
    // assert(close(covariance([1, 2, 3], [3, 2, 1]), -1));
});

test('Deserialize Json', () => {
    const res = execSync('cargo json').toString();
    const rack = new Rack();
    rack.deserialize(res);
});

// test('Linear Algebra', () => {});

// test('Calculus', () => {});
