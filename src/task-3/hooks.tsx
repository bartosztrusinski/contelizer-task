import { useState, useEffect, useEffectEvent } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(id);
  }, [delay, value]);

  return debouncedValue;
}

type UseQuery<T> = {
  queryKeys: unknown[];
  queryFn: (controller: AbortController) => Promise<T>;
  initialData: T;
};

export function useQuery<T>({ queryKeys, queryFn, initialData }: UseQuery<T>) {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchData = useEffectEvent(async (controller: AbortController) => {
    setIsLoading(true);
    setIsError(false);

    try {
      const result = await queryFn(controller);
      setData(result);
    } catch {
      if (controller.signal.aborted) return;
      setIsError(true);
    }

    setIsLoading(false);
  });

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller);
    return () => controller.abort();
  }, [...queryKeys]);

  return { data, setData, isLoading, isError };
}
