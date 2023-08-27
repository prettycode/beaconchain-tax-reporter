// TODO: Generated via GPT4, may need revision. Putting in place now to test testings.
import { join } from './join';

describe('join function', () => {
    test('joins an array of strings', () => {
        const input: Array<string> = ['a', 'b', 'c'];
        const output = 'a, b, c';
        expect(join(input)).toBe(output);
    });

    test('joins an array of numbers', () => {
        const input: Array<number> = [1, 2, 3];
        const output = '1, 2, 3';
        expect(join(input)).toBe(output);
    });

    test('joins an array of mixed types', () => {
        const input: Array<string | number> = ['a', 2, 'c'];
        const output = 'a, 2, c';
        expect(join(input)).toBe(output);
    });

    test('handles empty array', () => {
        const input: Array<string | number> = [];
        const output = '';
        expect(join(input)).toBe(output);
    });

    test('handles array with one element', () => {
        const input: Array<string | number> = ['a'];
        const output = 'a';
        expect(join(input)).toBe(output);
    });
});
