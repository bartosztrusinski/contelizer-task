import { useState, type FormEvent } from 'react';

const FILE_FIELD_NAME = 'file';
const ACCEPTED_FILE_EXTENSIONS = ['.txt', '.text'];
const ACCEPTED_MIME_TYPES = ['text/plain'];

export function FileTask() {
  const [error, setError] = useState<string | null>(null);
  const [shuffledText, setShuffledText] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get(FILE_FIELD_NAME);

    if (!(file instanceof File)) {
      setError('Could not read the file. Please try again.');
      setShuffledText(null);
      event.currentTarget.reset();
      return;
    }

    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      setError('Unsupported file type. Please upload a valid text file.');
      setShuffledText(null);
      event.currentTarget.reset();
      return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      const text = reader.result;

      if (typeof text !== 'string') {
        setError(
          'Failed to read file content. Please make sure to upload a valid text file.'
        );
        return;
      }

      const shuffledTest = text
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

      setShuffledText(shuffledTest);
      setError(null);
    });

    reader.readAsText(file);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Text File:
          <input
            type='file'
            name={FILE_FIELD_NAME}
            accept={[...ACCEPTED_FILE_EXTENSIONS, ...ACCEPTED_MIME_TYPES].join(
              ','
            )}
          />
        </label>
        <br />
        <button type='submit'>Shuffle Text</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {shuffledText && <pre>{shuffledText}</pre>}
    </>
  );
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
