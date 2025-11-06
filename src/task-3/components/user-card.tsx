import type { User } from '../types';

type Props = {
  user: User;
  onEdit: (userId: User['id']) => void;
};

export function UserCard({ user, onEdit }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <span style={{ fontWeight: 'bold' }}>{user.name}</span>
      <span>Email: {user.email}</span>
      <span>Gender: {user.gender}</span>
      <span>Status: {user.status}</span>
      <button style={{ width: '100%' }} onClick={() => onEdit(user.id)}>
        Edit
      </button>
    </div>
  );
}
