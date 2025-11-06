import { useState, type FormEvent } from 'react';
import { validatePesel } from './utils';

export function PeselTask() {
  const [message, setMessage] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const pesel = formData.get('pesel');
    const validationResult = validatePesel(pesel);

    setIsValid(validationResult.isSuccess);
    setMessage(
      validationResult.isSuccess
        ? 'PESEL is valid.'
        : `${validationResult.error} Please enter a valid PESEL.`
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          PESEL:
          <input type='text' required name={'pesel'} />
        </label>
        <br />
        <button type='submit'>Validate PESEL</button>
      </form>
      {message && <p style={{ color: isValid ? 'green' : 'red' }}>{message}</p>}
    </>
  );
}
