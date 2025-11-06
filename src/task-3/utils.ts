import { USERS_API_URL, USERS_PER_PAGE } from './constants';
import type { User } from './types';

export async function updateUser(
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

type GetUsersParams = {
  page: number;
  query?: string;
  controller?: AbortController;
};

export async function getUsers({
  page,
  query,
  controller,
}: GetUsersParams): Promise<User[]> {
  const usersUrl = new URL(USERS_API_URL);
  usersUrl.searchParams.append('page', String(page));
  usersUrl.searchParams.append('per_page', USERS_PER_PAGE.toString());

  if (query) {
    usersUrl.searchParams.append('name', query);
  }

  const response = await fetch(usersUrl, { signal: controller?.signal });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  const data = await response.json();
  return data;
}
