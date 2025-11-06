import { useState } from 'react';
import type { User } from './types';
import { updateUser } from './utils';

type Props = {
  user: User;
  isEditing: boolean;
  onEdit: (userId: User['id']) => void;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
};

export function UserCard({ user, isEditing, onEdit, onSave, onCancel }: Props) {
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    setIsSaving(true);

    try {
      const updatedUser = await updateUser(user.id, data);
      onSave(updatedUser);
    } catch {
      console.error('Failed to update user');
    }

    setIsSaving(false);
  }

  return (
    <div
      style={{
        border: '1px solid #656370',
        padding: '0.8rem',
        borderRadius: '0.4rem',
      }}>
      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label>
            Name:
            <input
              type='text'
              name='name'
              defaultValue={user.name}
              disabled={isSaving}
            />
          </label>
          <label>
            Email:
            <input
              type='email'
              name='email'
              defaultValue={user.email}
              disabled={isSaving}
            />
          </label>
          <label>
            Gender:
            <select
              name='gender'
              defaultValue={user.gender}
              disabled={isSaving}>
              <option value='male'>Male</option>
              <option value='female'>Female</option>
            </select>
          </label>
          <label>
            Status:
            <select
              name='status'
              defaultValue={user.status}
              disabled={isSaving}>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
            </select>
          </label>
          <button type='submit' disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button type='button' onClick={onCancel} disabled={isSaving}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <div style={{ fontWeight: 'bold' }}>{user.name}</div>
          <div>Email: {user.email}</div>
          <div>Gender: {user.gender}</div>
          <div>Status: {user.status}</div>
          <button style={{ width: '100%' }} onClick={() => onEdit(user.id)}>
            Edit
          </button>
        </>
      )}
    </div>
  );
}
