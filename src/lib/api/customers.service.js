import { ID, Query } from "appwrite";
import { endOfDay } from "date-fns";
import AppwriteService from "./appwrite.service";
import conf from "../Config/conf";

/**
 * Customers Service
 * Handles all customer/billing-related API operations
 */
class CustomersService extends AppwriteService {
  /**
   * Save customer bill/invoice
   * @param {Object} billData - Customer bill information
   * @returns {Promise<Object>} Created customer document
   */
  async saveCustomerBill({
    userId,
    customerName,
    invoiceId,
    paymentMethod,
    total,
    purchaseDate,
    selectedProducts,
  }) {
    try {
      // Convert products array to JSON string
      const arrayToJSON = JSON.stringify(selectedProducts);

      // Update stock for purchased products
      await this.updateProductsStock(selectedProducts);

      // Create customer/invoice document
      const saveCustomer = await this.database.createDocument(
        conf.DatabaseId,
        conf.customer,
        ID.unique(),
        {
          ownerId: userId,
          customerName,
          InvoiceNo: parseInt(invoiceId),
          totalSpent: total,
          productPurchased: arrayToJSON,
          paymentMethod,
          date: purchaseDate,
        }
      );

      return saveCustomer;
    } catch (error) {
      console.error("Error saving customer bill:", error);
      throw error;
    }
  }

  /**
   * Update stock for multiple products after purchase
   * @param {Array} products - Array of purchased products
   */
  async updateProductsStock(products) {
    try {
      const updatePromises = products.map(async (product) => {
        const newStock = product.Stock - product.quantity;
        return await this.database.updateDocument(
          conf.DatabaseId,
          conf.product,
          product.$id,
          {
            Stock: newStock,
          }
        );
      });

      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error updating products stock:", error);
      throw error;
    }
  }

  /**
   * Get customers/invoices with optional date filtering
   * @param {string} userId - User ID
   * @param {string|Date|Array} dateRange - Date filter ('all', single date, or date range)
   * @returns {Promise<Array>} Array of customer documents
   */
  async getCustomers(userId, dateRange = "all") {
    try {
      const filters = [Query.equal("ownerId", userId)];

      // Apply date filters
      if (dateRange !== "all") {
        if (Array.isArray(dateRange)) {
          // Date range filter
          filters.push(Query.greaterThanEqual("$createdAt", dateRange[0]));
          if (dateRange[1]) {
            filters.push(Query.lessThanEqual("$createdAt", dateRange[1]));
          }
        } else if (dateRange) {
          // Single date filter
          const endDate = endOfDay(dateRange);
          const endDateISO = new Date(
            endDate.getTime() + endDate.getTimezoneOffset() * 60000
          ).toISOString();

          filters.push(
            Query.greaterThanEqual("$createdAt", dateRange),
            Query.lessThanEqual("date", endDateISO)
          );
        }
      }

      // Fetch customers from database
      const response = await this.database.listDocuments(
        conf.DatabaseId,
        conf.customer,
        filters
      );

      return response.documents;
    } catch (error) {
      console.error("Error fetching customers:", error);
      return [];
    }
  }

  /**
   * Get a single customer/invoice by ID
   * @param {string} customerId - Customer ID
   * @returns {Promise<Object>} Customer document
   */
  async getCustomerById(customerId) {
    try {
      const customer = await this.database.getDocument(
        conf.DatabaseId,
        conf.customer,
        customerId
      );

      return customer;
    } catch (error) {
      console.error("Error fetching customer:", error);
      throw error;
    }
  }

  /**
   * Delete a customer/invoice
   * @param {string} customerId - Customer ID
   * @returns {Promise<Object>} Delete confirmation
   */
  async deleteCustomer(customerId) {
    try {
      const deleted = await this.database.deleteDocument(
        conf.DatabaseId,
        conf.customer,
        customerId
      );

      return deleted;
    } catch (error) {
      console.error("Error deleting customer:", error);
      throw error;
    }
  }

  /**
   * Get recent sales (limited number of recent customers)
   * @param {string} userId - User ID
   * @param {number} limit - Number of recent sales to fetch (default: 5)
   * @returns {Promise<Array>} Array of recent customer documents
   */
  async getRecentSales(userId, limit = 5) {
    try {
      const response = await this.database.listDocuments(
        conf.DatabaseId,
        conf.customer,
        [
          Query.equal("ownerId", userId),
          Query.orderDesc("$createdAt"),
          Query.limit(limit),
        ]
      );

      return response.documents;
    } catch (error) {
      console.error("Error fetching recent sales:", error);
      return [];
    }
  }
}

// Export singleton instance
const customersService = new CustomersService();
export default customersService;
