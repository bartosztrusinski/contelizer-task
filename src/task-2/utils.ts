import type { ValidationResult } from '../types';

export function validatePesel(pesel: unknown): ValidationResult {
  if (typeof pesel !== 'string') {
    return { isSuccess: false, error: 'PESEL must be a string.' };
  }

  const isElevenDigits = /^\d{11}$/.test(pesel);

  if (!isElevenDigits) {
    return { isSuccess: false, error: 'PESEL must be exactly 11 digits long.' };
  }

  const controlDigit = calculatePeselControlDigit(pesel);
  const lastDigit = Number(pesel[10]);

  if (controlDigit !== lastDigit) {
    return { isSuccess: false, error: 'Invalid control digit.' };
  }

  return { isSuccess: true };
}

function calculatePeselControlDigit(pesel: string): number {
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  const peselDigits = pesel.split('').map(Number);
  const weightedPeselDigits = weights.map(
    (weight, index) => (weight * peselDigits[index]) % 10
  );
  const weightedPeselSum = weightedPeselDigits.reduce(
    (sum, digit) => sum + digit,
    0
  );
  const controlDigit = 10 - (weightedPeselSum % 10);

  return controlDigit;
}
