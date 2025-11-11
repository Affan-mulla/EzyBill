import { ID, Query } from 'appwrite';
import AppwriteService from './appwrite.service';
import conf from '../Config/conf';

class AuthenticationService extends AppwriteService {
  async createUser({ email, shopName, password, name, phone }) {
    try {
      const createUserAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name,
        phone
      );

      if (!createUserAccount) {
        throw new Error('Failed to create user account');
      }

      const avatarUrl = this.avatars.getInitials(shopName);

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
      console.error('Error creating user:', error);
      throw error;
    }
  }

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
      console.error('Error saving user to database:', error);
      throw error;
    }
  }

  async signInAccount({ email, password }) {
    try {
      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );

      if (!session) {
        throw new Error('Failed to create session');
      }

      return session;
    } catch (error) {
      console.error('Error signing in:', error);
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
  async updateProfile(data) {
    try {
      let updates = {};
        const currentAccount = await this.account.get();

      const ownerId = data.get("ownerId");
      const shopName = data.get("shopName");
      const address = data.get("address");
      const phone = data.get("phone");
      const ownerName = data.get("ownerName");
      const email = data.get("email");
      const password = data.get("password");
      const file = data.get("file");
      // Update phone if provided
      if (currentAccount.phone !== phone && phone) {
        const phoneNo = `+91${phone}`;
        await this.account.updatePhone(phoneNo, password);
      }

      // Update name if provided
      if (ownerName) {
        await this.account.updateName(ownerName);
        updates.ownerName = ownerName;
      }

      if (address) {
        updates.address = address;
      }

      // Update email if provided
      if (email && email !== currentAccount.email) {
        
        await this.account.updateEmail(email, password);
        updates.email = email;
      }

      // Handle profile image upload
      if (file instanceof File) {
        const uploadedFile = await this.uploadFile(file); // internally uses ID.unique()
        if (uploadedFile) {
          const fileURL = await this.getFilePreview(uploadedFile.$id);
          if (fileURL) {
            updates.logo = fileURL;
          }
        }
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
