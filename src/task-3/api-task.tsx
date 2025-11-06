import { useState } from 'react';
import { UserList } from './user-list';
import type { User } from './types';
import { USERS_PER_PAGE } from './constants';
import { useDebounce, useQuery } from './hooks';
import { getUsers } from './utils';

export function ApiTask() {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const debouncedQuery = useDebounce(query, 500);
  const {
    data: users,
    setData: setUsers,
    isError,
    isLoading,
  } = useQuery<User[]>({
    queryKeys: [debouncedQuery, page],
    initialData: [],
    queryFn: (controller) =>
      getUsers({ page, query: debouncedQuery, controller }),
  });
  const isFirstPage = page === 1;
  const isLastPage = users.length < USERS_PER_PAGE;

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
        <UserList
          users={users}
          onUserUpdate={(updatedUser) =>
            setUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
              )
            )
          }
        />
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
