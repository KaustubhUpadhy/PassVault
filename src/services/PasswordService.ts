import { supabase, DatabasePassword, Password } from '../config/supabase';
import { PasswordEncryption } from '../utils/PasswordEncryption';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Service for managing passwords with both generation/strength checking AND encrypted storage
 */
export class PasswordService {
  
  // ============================================
  // PASSWORD GENERATION & SECURITY CHECKING
  // ============================================
  
  static async generatePassword(settings: {
    length: number;
    include_uppercase: boolean;
    include_lowercase: boolean;
    include_numbers: boolean;
    include_symbols: boolean;
  }): Promise<{
    password: string;
    entropy_bits: number;
  }> {
    const response = await fetch(`${API_BASE_URL}/api/security/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        length: settings.length,
        include_uppercase: settings.include_uppercase,
        include_lowercase: settings.include_lowercase,
        include_numbers: settings.include_numbers,
        include_symbols: settings.include_symbols,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate password');
    }

    return response.json();
  }

  static async checkStrength(
    password: string, 
    firstName?: string, 
    lastName?: string, 
    email?: string
  ): Promise<{
    score: number;
    strength_label: string;
    online_crack_time: string;
    offline_crack_time: string;
    warning: string;
    suggestions: string[];
  }> {
    const response = await fetch(`${API_BASE_URL}/api/security/strength`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
        first_name: firstName,
        last_name: lastName,
        email: email,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to check password strength');
    }

    return response.json();
  }

  static async checkBreach(password: string): Promise<{
    is_breached: boolean;
    breach_count: number;
    message: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/api/security/breach`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to check password breach');
    }

    return response.json();
  }

  // ============================================
  // ENCRYPTED PASSWORD STORAGE WITH SUPABASE
  // ============================================

  /**
   * Gets the current authenticated user
   * Throws error if not logged in
   */
  private static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error('User not authenticated');
    }
    return user;
  }

  /**
   * Converts database password to frontend format
   * Decrypts the password and maps field names
   */
  private static async convertToFrontendPassword(
    dbPassword: DatabasePassword, 
    userId: string
  ): Promise<Password> {
    const decryptedPassword = await PasswordEncryption.decryptPassword(
      dbPassword.encrypted_password, 
      userId
    );

    return {
      id: dbPassword.id,
      title: dbPassword.site_name, // Map site_name to title for frontend
      username: dbPassword.username,
      password: decryptedPassword,
      notes: dbPassword.notes,
      created_at: dbPassword.created_at,
      updated_at: dbPassword.updated_at
    };
  }

  /**
   * Get all passwords for the current user
   * RLS automatically filters to only show user's own passwords
   */
  static async getAllPasswords(): Promise<Password[]> {
    const user = await this.getCurrentUser();

    const { data, error } = await supabase
      .from('user_passwords')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to load passwords');
    }

    // Decrypt all passwords
    const decryptedPasswords = await Promise.all(
      data.map(password => this.convertToFrontendPassword(password, user.id))
    );

    return decryptedPasswords;
  }

  /**
   * Search passwords by site name or username
   * Uses Supabase's ilike operator for case-insensitive search
   */
  static async searchPasswords(query: string): Promise<Password[]> {
    const user = await this.getCurrentUser();

    if (!query.trim()) {
      return [];
    }

    const { data, error } = await supabase
      .from('user_passwords')
      .select('*')
      .or(`site_name.ilike.%${query}%,username.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Search error:', error);
      throw new Error('Failed to search passwords');
    }

    // Decrypt all passwords
    const decryptedPasswords = await Promise.all(
      data.map(password => this.convertToFrontendPassword(password, user.id))
    );

    return decryptedPasswords;
  }

  /**
   * Add a new password
   * Encrypts the password before storing
   */
  static async addPassword(passwordData: {
    title: string;
    username: string;
    password: string;
    notes?: string;
  }): Promise<Password> {
    const user = await this.getCurrentUser();

    // Encrypt the password before storing
    const encryptedPassword = await PasswordEncryption.encryptPassword(
      passwordData.password,
      user.id
    );

    const { data, error } = await supabase
      .from('user_passwords')
      .insert({
        user_id: user.id, // RLS will ensure this matches the authenticated user
        site_name: passwordData.title,
        username: passwordData.username,
        encrypted_password: encryptedPassword,
        notes: passwordData.notes || null
      })
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      throw new Error('Failed to add password');
    }

    // Return the password in frontend format
    return this.convertToFrontendPassword(data, user.id);
  }

  /**
   * Update an existing password
   * Only updates provided fields, encrypts password if changed
   */
  static async updatePassword(
    id: string, 
    updates: Partial<{
      title: string;
      username: string;
      password: string;
      notes: string;
    }>
  ): Promise<Password> {
    const user = await this.getCurrentUser();

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    // Only update fields that were provided
    if (updates.title !== undefined) updateData.site_name = updates.title;
    if (updates.username !== undefined) updateData.username = updates.username;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    
    // Encrypt password if it was updated
    if (updates.password !== undefined) {
      updateData.encrypted_password = await PasswordEncryption.encryptPassword(
        updates.password,
        user.id
      );
    }

    const { data, error } = await supabase
      .from('user_passwords')
      .update(updateData)
      .eq('id', id) // RLS ensures user can only update their own passwords
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      throw new Error('Failed to update password');
    }

    return this.convertToFrontendPassword(data, user.id);
  }

  /**
   * Delete multiple passwords by IDs
   * RLS ensures user can only delete their own passwords
   */
  static async deletePasswords(ids: string[]): Promise<void> {
    const { error } = await supabase
      .from('user_passwords')
      .delete()
      .in('id', ids); // RLS ensures user can only delete their own passwords

    if (error) {
      console.error('Delete error:', error);
      throw new Error('Failed to delete passwords');
    }
  }

  /**
   * Get a single password by ID
   * Useful for editing or viewing specific passwords
   */
  static async getPasswordById(id: string): Promise<Password | null> {
    const user = await this.getCurrentUser();

    const { data, error } = await supabase
      .from('user_passwords')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Get password error:', error);
      throw new Error('Failed to get password');
    }

    return this.convertToFrontendPassword(data, user.id);
  }

  // ============================================
  // LEGACY METHODS (for backward compatibility)
  // ============================================

  static async savePassword(passwordData: any): Promise<any> {
    // This was the old mock method - now redirect to the real addPassword
    return this.addPassword({
      title: passwordData.title || passwordData.site_name,
      username: passwordData.username,
      password: passwordData.password,
      notes: passwordData.notes
    });
  }

  static async getSavedPasswords(): Promise<Password[]> {
    // This was the old mock method - now redirect to the real getAllPasswords
    return this.getAllPasswords();
  }
}