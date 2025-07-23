import { User } from '../types';

export class AuthService {
  static async login(email: string, password: string): Promise<User> {
    // TODO: Implement with backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id: '1', email, name: 'Demo User' };
  }

  static async signup(email: string, password: string, name: string): Promise<User> {
    // TODO: Implement with backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id: '1', email, name };
  }

  static async logout(): Promise<void> {
    // TODO: Implement with backend
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}
