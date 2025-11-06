import { useState, type FormEvent } from 'react';
import { ACCEPTED_FILE_EXTENSIONS, ACCEPTED_MIME_TYPES } from './constants';
import { readTextFile, shuffleText, validateTextFile } from './utils';

export function FileTask() {
  const [error, setError] = useState<string | null>(null);
  const [shuffledText, setShuffledText] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const rawFile = formData.get('file');
    const validationResult = validateTextFile(rawFile);

    if (!validationResult.isSuccess) {
      setError(validationResult.error);
      setShuffledText(null);
      event.currentTarget.reset();
      return;
    }

    const { data: file } = validationResult;

    try {
      const text = await readTextFile(file);
      const shuffledText = shuffleText(text);
      setShuffledText(shuffledText);
      setError(null);
    } catch (error) {
      setShuffledText(null);
      setError(
        error instanceof Error ? error.message : 'Could not read the file.'
      );
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Text File:
          <input
            type='file'
            name='file'
            required
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
