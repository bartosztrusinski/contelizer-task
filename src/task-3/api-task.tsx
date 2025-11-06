import { useEffect, useEffectEvent, useState } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  gender: 'male' | 'female';
  status: 'active' | 'inactive';
};

const BASE_API_URL = 'https://gorest.co.in/public/v2';
const USERS_API_URL = `${BASE_API_URL}/users`;
const USERS_PER_PAGE = 10;

export function ApiTask() {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [editedUserId, setEditedUserId] = useState<number | null>(null);
  const debouncedQuery = useDebounce(query, 500);
  const {
    data: users,
    setData: setUsers,
    isError,
    isLoading,
  } = useQuery<User[]>({
    queryKeys: [debouncedQuery, page],
    initialData: [],
    queryFn: async (controller) => {
      const usersUrl = new URL(USERS_API_URL);
      usersUrl.searchParams.append('page', String(page));
      usersUrl.searchParams.append('per_page', USERS_PER_PAGE.toString());

      if (debouncedQuery) {
        usersUrl.searchParams.append('name', debouncedQuery);
      }

      const response = await fetch(usersUrl, { signal: controller.signal });
      const data = await response.json();
      return data;
    },
  });
  const isFirstPage = page === 1;
  const isLastPage = users.length < USERS_PER_PAGE;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name');

    if (editedUserId && typeof name === 'string') {
      try {
        const updatedUser = await updateUser(editedUserId, { name });
        setEditedUserId(null);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          )
        );
      } catch (error) {
        console.error('Failed to update user:', error);
      }
    }
  }

  return (
    <>
      <form onSubmit={(event) => event.preventDefault()}>
        <label>
          Search Users:
          <input
            type='search'
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
          />
        </label>
        <button type='submit'>Search</button>
      </form>
      {isError && (
        <p style={{ color: 'red' }}>
          Something went wrong while fetching users.
        </p>
      )}
      {users.length === 0 ? (
        <p>{isLoading ? 'Loading...' : 'No users found.'}</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {editedUserId === user.id ? (
                <form onSubmit={handleSubmit}>
                  <input type='text' name='name' defaultValue={user.name} />
                  <button type='submit'>Save</button>
                </form>
              ) : (
                <>
                  {user.name}
                  <button onClick={() => setEditedUserId(user.id)}>Edit</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => setPage((prev) => prev - 1)}
        disabled={isFirstPage || isLoading}>
        Previous
      </button>
      <span>{page}</span>
      <button
        onClick={() => setPage((prev) => prev + 1)}
        disabled={isLastPage || isLoading}>
        Next
      </button>
    </>
  );
}

async function updateUser(
  userId: User['id'],
  data: Partial<User>
): Promise<User> {
  const response = await fetch(`${USERS_API_URL}/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  return response.json();
}

function useDebounce<T>(value: T, delay: number): T {
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

function useQuery<T>({ queryKeys, queryFn, initialData }: UseQuery<T>) {
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
