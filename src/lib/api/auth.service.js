import { ID, Query } from "appwrite";
import AppwriteService from "./appwrite.service";
import conf from "../Config/conf";

/**
 * Authentication Service
 * Handles all authentication and user-related operations
 */
class AuthenticationService extends AppwriteService {
  /**
   * Create a new user account
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user document
   */
  async createUser({ email, shopName, password, name, phone }) {
    try {
      // Create Appwrite account
      const createUserAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name,
        phone
      );

      if (!createUserAccount) {
        throw new Error("Failed to create user account");
      }

      // Generate avatar
      const avatarUrl = this.avatars.getInitials(shopName);

      // Save user to database
      const newUser = await this.saveUserToDB({
        account: createUserAccount.$id,
        email,
        name,
        shopName,
        avatarUrl,
        phone,
      });

      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  /**
   * Save user information to database
   * @param {Object} userData - User data to save
   * @returns {Promise<Object>} Saved user document
   */
  async saveUserToDB({ account, email, name, avatarUrl, shopName, phone }) {
    try {
      const userDoc = await this.database.createDocument(
        conf.DatabaseId,
        conf.owner,
        ID.unique(),
        {
          shopName,
          email,
          accountid: account,
          ownerName: name,
          logo: avatarUrl,
          phone,
        }
      );

      return userDoc;
    } catch (error) {
      console.error("Error saving user to database:", error);
      throw error;
    }
  }

  /**
   * Sign in to account
   * @param {Object} credentials - Email and password
   * @returns {Promise<Object>} Session object
   */
  async signInAccount({ email, password }) {
    try {
      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );

      if (!session) {
        throw new Error("Failed to create session");
      }

      return session;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  }

  /**
   * Get current logged-in user
   * @returns {Promise<Object>} Current user document
   */
  async getCurrentUser() {
    try {
      // Get current account
      const currentAccount = await this.account.get();
      if (!currentAccount) {
        throw new Error("No active session");
      }

      // Get user document from database
      const currentUser = await this.database.listDocuments(
        conf.DatabaseId,
        conf.owner,
        [Query.equal("accountid", currentAccount.$id)]
      );

      if (!currentUser || currentUser.documents.length === 0) {
        throw new Error("User not found");
      }

      return currentUser.documents[0];
    } catch (error) {
      console.error("Error getting current user:", error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {Object} updateData - Profile update data
   * @returns {Promise<Object>} Updated user document
   */
  async updateProfile({
    ownerId,
    shopName,
    phone,
    imageUrl,
    ownerName,
    email,
    file,
    password,
  }) {
    try {
      let updates = {};

      // Update phone if provided
      if (phone) {
        const phoneNo = `+91${phone}`;
        await this.account.updatePhone(phoneNo, password);
      }

      // Update name if provided
      if (ownerName) {
        await this.account.updateName(ownerName);
        updates.ownerName = ownerName;
      }

      // Update email if provided
      if (email) {
        await this.account.updateEmail(email, password);
        updates.email = email;
      }

      // Handle profile image upload
      if (file && file.length > 0) {
        const uploadedFile = await this.uploadFile(file[0]);
        if (uploadedFile) {
          const fileURL = await this.getFilePreview(uploadedFile.$id);
          if (fileURL) {
            updates.logo = fileURL;
          }
        }
      } else if (imageUrl) {
        updates.logo = imageUrl;
      }

      // Update shop name if provided
      if (shopName) {
        updates.shopName = shopName;
      }

      // Update user document in database
      const updatedUser = await this.database.updateDocument(
        conf.DatabaseId,
        conf.owner,
        ownerId,
        updates
      );

      return updatedUser;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  /**
   * Logout current user
   * @returns {Promise<Object>} Logout confirmation
   */
  async logout() {
    try {
      await this.account.deleteSession("current");
      return { success: true };
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }
}

// Export singleton instance
const authService = new AuthenticationService();
export default authService;
