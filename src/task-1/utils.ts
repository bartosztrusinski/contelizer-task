import { ACCEPTED_MIME_TYPES } from './constants';

type ValidationResult<T> =
  | { isSuccess: true; data: T }
  | { isSuccess: false; error: string };

export function validateTextFile(file: unknown): ValidationResult<File> {
  if (!(file instanceof File)) {
    return {
      isSuccess: false,
      error: 'The provided input is not a valid file.',
    };
  }

  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    return {
      isSuccess: false,
      error: 'Unsupported file type. Please upload a valid text file.',
    };
  }

  return {
    isSuccess: true,
    data: file,
  };
}

export function shuffleText(text: string): string {
  return text
    .split(/\r?\n/)
    .map((line) => {
      // Split line into tokens of words and non-words
      const tokens = line.match(/(\p{L}+|[^\p{L}]+)/gu) ?? [];
      // Shuffle only the word tokens, leave others unchanged
      return tokens
        .map((token) => {
          const isWord = /\p{L}/u.test(token);
          return isWord ? shuffleWordMiddle(token) : token;
        })
        .join('');
    })
    .join('\n');
}

function shuffleWordMiddle(word: string): string {
  if (word.length <= 3) {
    return word;
  }

  const firstCharacter = word[0];
  const lastCharacter = word.at(-1);
  const middleCharacters = word.slice(1, -1).split('');
  const shuffledMiddleCharacters = shuffleArray(middleCharacters).join('');

  return firstCharacter + shuffledMiddleCharacters + lastCharacter;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

export function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      const text = reader.result;

      if (typeof text !== 'string') {
        reject(
          new Error(
            'Failed to read file content. Please make sure to upload a valid text file.'
          )
        );
        return;
      }

      resolve(text);
    });

    reader.addEventListener('error', () => {
      reject(new Error('Error reading the file.'));
    });

    reader.readAsText(file);
  });
}
