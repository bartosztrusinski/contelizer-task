import { useState } from 'react';
import type { User } from './types';
import { UserCard } from './user-card';
import { EditUserForm } from './edit-user-form';

type Props = {
  users: User[];
  onUserUpdate: (updatedUser: User) => void;
};

export function UserList({ users, onUserUpdate }: Props) {
  const [editedUserId, setEditedUserId] = useState<number | null>(null);

  return (
    <ul style={{ listStyle: 'none', padding: 0, width: 'fit-content' }}>
      {users.map((user) => (
        <li
          key={user.id}
          style={{
            marginBottom: '1rem',
            border: '1px solid #656370',
            padding: '0.8rem',
            borderRadius: '0.4rem',
          }}>
          {editedUserId === user.id ? (
            <EditUserForm
              user={user}
              onSave={(updatedUser) => {
                onUserUpdate(updatedUser);
                setEditedUserId(null);
              }}
              onCancel={() => setEditedUserId(null)}
            />
          ) : (
            <UserCard
              user={user}
              onEdit={(userId) => setEditedUserId(userId)}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
