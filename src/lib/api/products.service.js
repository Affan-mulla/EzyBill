import { ID, Query } from 'appwrite';
import AppwriteService from './appwrite.service';
import conf from '../Config/conf';

class ProductsService extends AppwriteService {
  async createProduct({
    userId,
    productName,
    stock,
    price,
    images,
    description,
  }) {
    try {
      const uploadedFile = await this.uploadFile(images[0]);
      if (!uploadedFile) {
        throw new Error('Failed to upload image');
      }

      const fileURL = await this.getFilePreview(uploadedFile.$id);
      if (!fileURL) {
        await this.deleteFile(uploadedFile.$id);
        throw new Error('Failed to get image preview');
      }

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
        throw new Error('Failed to create product');
      }

      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async getProducts(userId) {
    try {
      const response = await this.database.listDocuments(
        conf.DatabaseId,
        conf.product,
        [Query.equal('productOwner', userId), Query.limit(1000)]
      );

      if (response.documents.length > 0) {
        const updatedProducts = response.documents.map((product) => ({
          ...product,
          productImage: product.productImage?.replace('/preview', '/view'),
        }));

        return updatedProducts;
      }

      return [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      const product = await this.database.getDocument(
        conf.DatabaseId,
        conf.product,
        productId
      );

      const updatedProducts = {
        ...product,
        productImage: product.productImage?.replace("/preview", "/view"),
      }
      return updatedProducts;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

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

      if (hasFileToUpdate) {
        const uploadedFile = await this.uploadFile(images[0]);
        if (!uploadedFile) {
          throw new Error('Failed to upload new image');
        }

        const fileUrl = await this.getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
          await this.deleteFile(uploadedFile.$id);
          throw new Error('Failed to get new image preview');
        }

        if (imageId) {
          await this.deleteFile(imageId);
        }

        image = { imageUrl: fileUrl, imageId: uploadedFile.$id };
      }

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
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      const product = await this.getProductById(productId);

      const deleted = await this.database.deleteDocument(
        conf.DatabaseId,
        conf.product,
        productId
      );

      if (product.imageId) {
        await this.deleteFile(product.imageId);
      }

      return deleted;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

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
      console.error('Error updating stock:', error);
      throw error;
    }
  }
}

const productsService = new ProductsService();
export default productsService;
