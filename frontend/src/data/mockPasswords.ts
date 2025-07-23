export interface Password {
  id: string;
  title: string;
  username: string;
  password: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const mockPasswords: Password[] = [
  {
    id: '1',
    title: 'Gmail',
    username: 'john.doe@gmail.com',
    password: 'MyGmail123!',
    notes: 'Personal email account',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'GitHub',
    username: 'johndoe',
    password: 'GitH@b2024!',
    notes: 'Development account',
    created_at: '2024-01-20T14:15:00Z',
    updated_at: '2024-01-25T09:45:00Z'
  },
  {
    id: '3',
    title: 'Netflix',
    username: 'john.doe@email.com',
    password: 'Netflix$2024',
    notes: 'Family subscription',
    created_at: '2024-02-01T20:00:00Z',
    updated_at: '2024-02-01T20:00:00Z'
  },
  {
    id: '4',
    title: 'LinkedIn',
    username: 'john.doe',
    password: 'LinkedIn!Pass2024',
    notes: 'Professional networking',
    created_at: '2024-02-10T11:30:00Z',
    updated_at: '2024-02-15T16:20:00Z'
  },
  {
    id: '5',
    title: 'AWS Console',
    username: 'admin@company.com',
    password: 'AWS$ecure2024!',
    notes: 'Company cloud account - handle with care',
    created_at: '2024-02-20T08:00:00Z',
    updated_at: '2024-02-20T08:00:00Z'
  }
];