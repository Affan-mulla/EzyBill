import { ID, Query } from "appwrite";
import AppwriteService from "./appwrite.service";
import conf from "../Config/conf";

/**
 * Products Service
 * Handles all product-related API operations
 */
class ProductsService extends AppwriteService {
  /**
   * Create a new product
   * @param {Object} productData - Product information
   * @returns {Promise<Object>} Created product document
   */
  async createProduct({
    userId,
    productName,
    stock,
    price,
    images,
    description,
  }) {
    try {
      // Upload product image
      const uploadedFile = await this.uploadFile(images[0]);
      if (!uploadedFile) {
        throw new Error("Failed to upload image");
      }

      // Get image URL
      const fileURL = await this.getFilePreview(uploadedFile.$id);
      if (!fileURL) {
        await this.deleteFile(uploadedFile.$id);
        throw new Error("Failed to get image preview");
      }

      // Create product document
      const newProduct = await this.database.createDocument(
        conf.DatabaseId,
        conf.product,
        ID.unique(),
        {
          productName,
          Stock: parseInt(stock),
          price: Number(price),
          productImage: fileURL,
          imageId: uploadedFile.$id,
          description,
          productOwner: userId,
        }
      );

      if (!newProduct) {
        await this.deleteFile(uploadedFile.$id);
        throw new Error("Failed to create product");
      }

      return newProduct;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  /**
   * Get all products for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of product documents
   */
  async getProducts(userId) {
  try {
    const response = await this.database.listDocuments(
      conf.DatabaseId,
      conf.product,
      [Query.equal("productOwner", userId), Query.limit(1000)]
    );

    if (response.documents.length > 0) {
      const updatedProducts = response.documents.map((product) => ({
        ...product,
        productImage: product.productImage?.replace("/preview", "/view"),
      }));
      console.log(updatedProducts);
      
      return updatedProducts;
    }

    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}


  /**
   * Get a single product by ID
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Product document
   */
  async getProductById(productId) {
    try {
      const product = await this.database.getDocument(
        conf.DatabaseId,
        conf.product,
        productId
      );

      return product;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  /**
   * Update an existing product
   * @param {Object} updateData - Updated product data
   * @returns {Promise<Object>} Updated product document
   */
  async updateProduct({
    userId,
    productName,
    stock,
    price,
    images,
    description,
    imageId,
    imageUrl,
    productId,
  }) {
    try {
      const hasFileToUpdate = images.length > 0;
      let image = {
        imageUrl: imageUrl,
        imageId: imageId,
      };

      // Handle new image upload
      if (hasFileToUpdate) {
        const uploadedFile = await this.uploadFile(images[0]);
        if (!uploadedFile) {
          throw new Error("Failed to upload new image");
        }

        const fileUrl = await this.getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
          await this.deleteFile(uploadedFile.$id);
          throw new Error("Failed to get new image preview");
        }

        // Delete old image
        if (imageId) {
          await this.deleteFile(imageId);
        }

        image = { imageUrl: fileUrl, imageId: uploadedFile.$id };
      }

      // Update product document
      const updated = await this.database.updateDocument(
        conf.DatabaseId,
        conf.product,
        productId,
        {
          productName,
          Stock: parseInt(stock),
          price: Number(price),
          productImage: image.imageUrl,
          imageId: image.imageId,
          description,
          productOwner: userId,
        }
      );

      return updated;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  /**
   * Delete a product
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Delete confirmation
   */
  async deleteProduct(productId) {
    try {
      // Get product to access imageId
      const product = await this.getProductById(productId);
      
      // Delete product document
      const deleted = await this.database.deleteDocument(
        conf.DatabaseId,
        conf.product,
        productId
      );

      // Delete associated image
      if (product.imageId) {
        await this.deleteFile(product.imageId);
      }

      return deleted;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  /**
   * Update product stock
   * @param {string} productId - Product ID
   * @param {number} newStock - New stock quantity
   * @returns {Promise<Object>} Updated product
   */
  async updateStock(productId, newStock) {
    try {
      const updated = await this.database.updateDocument(
        conf.DatabaseId,
        conf.product,
        productId,
        {
          Stock: newStock,
        }
      );

      return updated;
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error;
    }
  }
}

// Export singleton instance
const productsService = new ProductsService();
export default productsService;
