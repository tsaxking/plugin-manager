import assert from 'assert';
import test from 'test';
import { $Math, Random } from '../app/front/src/utils/math';
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
} from '../app/front/src/utils/text';
import {
    standardDeviation,
    mean,
    median,
    mode,
    range,
} from '../app/front/src/utils/calcs/statistics';

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


// test('Linear Algebra', () => {});

// test('Calculus', () => {});
