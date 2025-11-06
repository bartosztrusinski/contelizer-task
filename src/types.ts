export type ValidationResult<T = undefined> =
  | (T extends undefined ? { isSuccess: true } : { isSuccess: true; data: T })
  | { isSuccess: false; error: string };
