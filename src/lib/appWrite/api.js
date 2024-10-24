import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "appwrite";
import conf from "../Config/conf";
import { endOfDay } from "date-fns";



export class AuthService {
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

  async createUser({ email, shopName, password, name, phone }) {
    try {
      const createUserAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name,
        phone
      );

      if (!createUserAccount) throw error;

      const avatarUrl = this.avatars.getInitials(shopName);

    

      const newUser = await this.saveUserToDB({
        account: createUserAccount.$id, // Assuming you want to store the user ID
        email,
        name,
        shopName,
        avatarUrl,
        phone,
      });

      return newUser;
    } catch (error) {
      console.log(error);
    }
  }

  async saveUserToDB({ account, email, name, avatarUrl, shopName, phone }) {
    try {
      return await this.database.createDocument(
        conf.DatabaseId,
        conf.owner, // Ensure this is CollectionId, not ProjectId
        ID.unique(),
        {
          shopName,
          email,
          accountid: account,
          ownerName: name,
          shopName,
          logo: avatarUrl,
          phone,
        }
      );
    } catch (error) {
      throw new Error("Failed to save user to database: " + error.message);
    }
  }

  async signInAccount({ email, password }) {
    try {
      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );

      if (!session) throw error;

      return session;
    } catch (error) {
      console.log(error);
    }
  }

  async getCurrentUser() {
    try {
      const currentAccount = await this.account.get();
      if (!currentAccount) {
        throw error;
      }
    

      const currentUser = await this.database.listDocuments(
        conf.DatabaseId,
        conf.owner,
        [Query.equal("accountid", currentAccount.$id)]
      );

      if (!currentUser) throw error;

      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
    }
  }

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

      if (!uploadedFile) throw error;

      const fileURL = await this.getFilePreview(uploadedFile.$id);

      if (!fileURL) {
        this.deleteFile(uploadedFile.$id);
        throw error;
      }

      const newProduct = await this.database.createDocument(
        conf.DatabaseId,
        conf.product,
        ID.unique(),
        {
          productName: productName,
          Stock: parseInt(stock),
          price: Number(price),
          productImage: fileURL,
          imageId: uploadedFile.$id,
          description: description,
          productOwner: userId,
        }
      );

      if (!newProduct) {
        await this.deleteFile(uploadedFile.$id);
        throw error;
      }

      return newProduct;
    } catch (error) {
      console.log(error);
    }
  }

  async uploadFile(file) {
    try {
      const uploadedFile = await this.storage.createFile(
        conf.BucketId,
        ID.unique(),
        file
      );

      return uploadedFile;
    } catch (error) {
      console.log(error);
    }
  }

  async getFilePreview(fileId) {
    try {
      const fileUrl = this.storage.getFilePreview(
        conf.BucketId,
        fileId,
        2000,
        2000,
        "top",
        100
      );

      return fileUrl;
    } catch (error) {
      console.log(error);
    }
  }

  async getProduct(userId) {
    try {
      const fetchProducts = await this.database.listDocuments(
        conf.DatabaseId,
        conf.product,
        [Query.equal("productOwner", userId)]
      );

      if (!fetchProducts) throw error;

      return fetchProducts.documents;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(productId) {
    try {
      const deleted = await this.database.deleteDocument(
        conf.DatabaseId,
        conf.product,
        productId
      );

      if (!deleted) throw error;

      return deleted;
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      const product = await this.database.getDocument(
        conf.DatabaseId,
        conf.product,
        id
      );

      if (!product) throw error;

      return product;
    } catch (error) {
      console.log(error);
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
    const hasFileToUpdate = images.length > 0;
    try {
      let image = {
        imageUrl: imageUrl,
        imageId: imageId,
      };

      if (hasFileToUpdate) {
        const uploadedFile = await this.uploadFile(images[0]);
        if (!uploadedFile) throw error;

        const fileUrl = await this.getFilePreview(uploadedFile.$id);

        if (!fileUrl) {
          this.deleteFile(uploadedFile.$id);
          throw error;
        }

        image = { imageUrl: fileUrl, imageId: uploadedFile.$id };
      }

      const updated = await this.database.updateDocument(
        conf.DatabaseId,
        conf.product,
        productId,
        {
          productName: productName,
          Stock: parseInt(stock),
          price: Number(price),
          productImage: image.imageUrl,
          imageId: image.imageId,
          description: description,
          productOwner: userId,
        }
      );
      if (!updated) throw error;
      return updated;
    } catch (error) {
      console.log(error);
    }
  }

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
     

      const arrayToJSON = JSON.stringify(selectedProducts);
      const stockUpdate = this.updateStock(selectedProducts);

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

      if (!saveCustomer) throw error;
      return saveCustomer;
    } catch (error) {
      console.log(error);
    }
  }

  async updateStock(data) {
    data.map(async (row) => {
      const newStock = row.Stock - row.quantity;
      const updateProduct = await this.database.updateDocument(
        conf.DatabaseId,
        conf.product,
        row.$id,
        {
          Stock: newStock,
        }
      );
    });
  }

  async getCustomers(userId, dateRange) {
    try {
      
      const filters = [
        Query.equal("ownerId", userId),
      ];
      

      
      if (dateRange !== "all") {
        if (Array.isArray(dateRange)) {
        
          filters.push(
            Query.greaterThanEqual('$createdAt',dateRange[0]),
          );
        } else if (dateRange) {
          
          filters.push(
            Query.greaterThanEqual('$createdAt',dateRange),
            Query.lessThanEqual('date',endOfDay(dateRange))
     
          );
        }
      }
      // Fetch customers from the Appwrite database
      const getCustomers = await this.database.listDocuments(
        conf.DatabaseId,
        conf.customer,
        filters
      );
  
      return getCustomers.documents; // Return the array of customer documentswwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
    } catch (error) {
      console.error("Error fetching customers:", error);
      return []; // Return an empty array or handle it based on your app's needs
    }
  }

  async updateProfile({ownerId,shopName,phone,imageUrl,ownerName,email,file,password}){
    try {

      if(phone) {
        let phoneNo = `+91${phone}`
        const updatedPhone  = this.account.updatePhone(phoneNo,password)
        if(!updatedPhone) throw error

      }
      let hasFileToUpdate = false;

      if (file)  hasFileToUpdate = file.length > 0;

      let image = {
        imageUrl: imageUrl,
      };

      if (hasFileToUpdate) {
        const uploadedFile = await this.uploadFile(file[0]);
        if (!uploadedFile) throw error;

        const fileUrl = await this.getFilePreview(uploadedFile.$id);

        if (!fileUrl) {
          this.deleteFile(uploadedFile.$id);
          throw error;
        }

        image = { imageUrl: fileUrl, imageId: uploadedFile.$id };
      }

      const updatedProfile = this.database.updateDocument(
        conf.DatabaseId,
        conf.owner,
        ownerId,
        {
          ownerName,
          shopName,
          email,
          logo : image.imageUrl,
          phone
        }
      )

      if(!updatedProfile) throw error

      return updatedProfile
    } catch (error) {
      console.log(error);
      
    }
  }

  async logout() {
    try {
      const logout = await this.account.deleteSession("current")
      if(!logout) throw error
      return logout
    } catch (error) {
      console.log(error);
      
    }
  }

  async recentSales(userId) {
    try {
      const recent = await this.database.listDocuments(
        conf.DatabaseId,
        conf.customer,
        [Query.equal('ownerId', userId), Query.limit(5), Query.orderDesc()]
      )

      if(!recent) throw error
      return recent.documents
    } catch (error) {
      console.log(error);
      
    }
  }

  async deleteCustomer(cID) {
    try {
      const deleted = await this.database.deleteDocument(
        conf.DatabaseId,
        conf.customer,
        cID
      )
      if(!deleted) throw error
      return deleted
    } catch (error) {
      console.log(error);
      
    }
  }
  
  
}

const authService = new AuthService();
export default authService;
