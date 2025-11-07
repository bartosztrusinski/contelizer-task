import { useEffect, useState } from 'react';
import { UserList } from './components/user-list';
import type { User } from './types';
import { USERS_PER_PAGE } from './constants';
import { useDebounce, useQuery } from './hooks';
import { getUsers } from './utils';
import { Pagination } from './components/pagination';

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

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  return (
    <>
      <label>
        Search Users:
        <input
          type='search'
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label='Search users by name'
        />
      </label>

      {isError ? (
        <p style={{ color: 'red' }}>
          Something went wrong while fetching users.
        </p>
      ) : users.length > 0 ? (
        <div style={{ opacity: isLoading ? 0.5 : 1 }}>
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
        </div>
      ) : isLoading ? (
        <p>Loading...</p>
      ) : (
        <p>No users found.</p>
      )}

      <Pagination
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
        currentPage={page}
        onPageChange={(newPage) => setPage(newPage)}
        isDisabled={isLoading}
      />
    </>
  );
}
