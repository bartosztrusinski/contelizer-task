import { useState } from 'react';
import type { User } from './types';
import { UserCard } from './user-card';

type Props = {
  users: User[];
  onUserUpdate: (updatedUser: User) => void;
};

export function UserList({ users, onUserUpdate }: Props) {
  const [editedUserId, setEditedUserId] = useState<number | null>(null);

  return (
    <ul style={{ listStyle: 'none', padding: 0, width: 'fit-content' }}>
      {users.map((user) => (
        <li key={user.id} style={{ marginBottom: '1rem' }}>
          <UserCard
            isEditing={editedUserId === user.id}
            user={user}
            onEdit={(userId) => setEditedUserId(userId)}
            onSave={(updatedUser) => {
              onUserUpdate(updatedUser);
              setEditedUserId(null);
            }}
            onCancel={() => setEditedUserId(null)}
          />
        </li>
      ))}
    </ul>
  );
}
