/**
 * Legacy API wrapper for backward compatibility  
 * This file wraps the new modular service architecture
 * 
 * @deprecated Gradually migrate to importing services directly from /lib/api
 * Example: import { authService, productsService } from "@/lib/api"
 */

import authService from "../api/auth.service";
import productsService from "../api/products.service";
import customersService from "../api/customers.service";

/**
 * Legacy wrapper class that delegates to new modular services
 * Maintains backward compatibility with existing code
 */
export class AuthService {
  async createUser(userData) {
    return authService.createUser(userData);
  }

  async saveUserToDB(userData) {
    return authService.saveUserToDB(userData);
  }

  async signInAccount(credentials) {
    return authService.signInAccount(credentials);
  }

  async getCurrentUser() {
    return authService.getCurrentUser();
  }

  async updateProfile(updateData) {
    return authService.updateProfile(updateData);
  }

  async logout() {
    return authService.logout();
  }

  async createProduct(productData) {
    return productsService.createProduct(productData);
  }

  async getProduct(userId) {
    return productsService.getProducts(userId);
  }

  async getProductById(productId) {
    return productsService.getProductById(productId);
  }

  async updateProduct(updateData) {
    return productsService.updateProduct(updateData);
  }

  async deleteProduct(productId) {
    return productsService.deleteProduct(productId);
  }

  async saveCustomerBill(billData) {
    return customersService.saveCustomerBill(billData);
  }

  async getCustomers(userId, dateRange) {
    return customersService.getCustomers(userId, dateRange);
  }

  async deleteCustomer(customerId) {
    return customersService.deleteCustomer(customerId);
  }

  async recentSales(userId) {
    return customersService.getRecentSales(userId);
  }

  async updateStock(products) {
    return customersService.updateProductsStock(products);
  }

  async uploadFile(file) {
    return authService.uploadFile(file);
  }

  async getFilePreview(fileId) {
    return authService.getFilePreview(fileId);
  }

  async deleteFile(fileId) {
    return authService.deleteFile(fileId);
  }
}

const legacyAuthService = new AuthService();
export default legacyAuthService;
