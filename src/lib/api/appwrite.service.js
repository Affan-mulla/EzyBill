import { Account, Avatars, Client, Databases, ID, Query, Storage } from "appwrite";
import conf from "../Config/conf";

/**
 * Base Appwrite Service
 * Initializes Appwrite client and services
 */
class AppwriteService {
  client = new Client();
  account;
  database;
  storage;
  avatars;

  constructor() {
    this.client.setEndpoint(conf.Url).setProject(conf.ProjectId);
    this.account = new Account(this.client);
    this.database = new Databases(this.client);
    this.storage = new Storage(this.client);
    this.avatars = new Avatars(this.client);
  }

  /**
   * Upload file to Appwrite storage
   */
  async uploadFile(file) {
    try {
      console.log("Uploading new file with random ID:", ID.unique());

      const uploadedFile = await this.storage.createFile(
        conf.BucketId,
        ID.unique(),
        file
      );
      return uploadedFile;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  /**
   * Get file preview URL
   */
  async getFilePreview(fileId) {
    try {
      console.log("file");
      
      const fileUrl = this.storage.getFilePreview(
        conf.BucketId,
        fileId,
      );
      return fileUrl;
    } catch (error) {
      console.error("Error getting file preview:", error);
      throw error;
    }
  }

  /**
   * Delete file from storage
   */
  async deleteFile(fileId) {
    try {
      await this.storage.deleteFile(conf.BucketId, fileId);
      return { success: true };
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }
}

export default AppwriteService;
