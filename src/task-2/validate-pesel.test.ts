import { describe, expect, test } from 'vitest';
import { validatePesel } from './utils';

describe('validatePesel', () => {
  test('should accept valid PESEL', () => {
    expect(validatePesel('44051401458')).toEqual({ isSuccess: true });
  });

  test.each<[string, unknown]>([
    ['number', 12345678901],
    ['null', null],
    ['undefined', undefined],
    ['object', { pesel: '44051401458' }],
  ])('should reject non-string input (%s)', (_, value) => {
    expect(validatePesel(value)).toEqual({
      isSuccess: false,
      error: 'PESEL must be a string.',
    });
  });

  test.each<[string, string]>([
    ['too short', '12345'],
    ['too long', '123456789012'],
    ['non-digit characters', 'abcdefghijk'],
  ])('should reject invalid length (%s)', (_, value) => {
    expect(validatePesel(value)).toEqual({
      isSuccess: false,
      error: 'PESEL must be exactly 11 digits long.',
    });
  });

  test.each<string>(['44051401456', '12345678901', '44051401459'])(
    'should reject invalid control digit (%s)',
    (value) => {
      expect(validatePesel(value)).toEqual({
        isSuccess: false,
        error: 'Invalid control digit.',
      });
    }
  );
});
