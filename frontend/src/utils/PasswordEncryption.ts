/**
 * Client-side password encryption utility
 * 
 * How it works:
 * 1. Uses the user's UUID from Supabase auth as part of the encryption key
 * 2. Combines user ID with a secret salt to create a unique key per user
 * 3. Uses AES-GCM encryption (industry standard) for security
 * 4. Each password gets a random IV (initialization vector) for additional security
 */

export class PasswordEncryption {
  // Secret salt - in production, store this in environment variables
  private static readonly APP_SECRET_SALT = "your-app-secret-salt-2024-password-manager";

  /**
   * Generates a unique encryption key for each user
   * This key is derived from their user ID + secret salt
   */
  private static async generateUserKey(userId: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const data = encoder.encode(userId + this.APP_SECRET_SALT);
    
    // Create a hash of the user ID + salt
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert the hash into an AES encryption key
    return await crypto.subtle.importKey(
      'raw',
      hashBuffer,
      { name: 'AES-GCM' },
      false, // Not extractable - key stays in memory
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypts a password for storage
   * Each password gets a unique random IV for maximum security
   */
  static async encryptPassword(password: string, userId: string): Promise<string> {
    try {
      const key = await this.generateUserKey(userId);
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      
      // Generate a random initialization vector (IV)
      // This ensures the same password encrypts differently each time
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt the password
      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );
      
      // Combine IV + encrypted data into a single array
      const combined = new Uint8Array(iv.length + encryptedData.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedData), iv.length);
      
      // Convert to base64 string for storage
      return btoa(String.fromCharCode.apply(null, Array.from(combined)));
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt password');
    }
  }

  /**
   * Decrypts a password for display
   * Extracts the IV and uses it to decrypt the password
   */
  static async decryptPassword(encryptedPassword: string, userId: string): Promise<string> {
    try {
      const key = await this.generateUserKey(userId);
      
      // Convert base64 back to bytes
      const combined = new Uint8Array(
        atob(encryptedPassword).split('').map(c => c.charCodeAt(0))
      );
      
      // Extract IV (first 12 bytes) and encrypted data (rest)
      const iv = combined.slice(0, 12);
      const encryptedData = combined.slice(12);
      
      // Decrypt the password
      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encryptedData
      );
      
      // Convert back to string
      return new TextDecoder().decode(decryptedData);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt password');
    }
  }

  /**
   * Utility function to check if encryption is supported
   * Modern browsers support this, but good to check
   */
  static isSupported(): boolean {
    return typeof crypto !== 'undefined' && 
           typeof crypto.subtle !== 'undefined' &&
           typeof crypto.getRandomValues !== 'undefined';
  }
}