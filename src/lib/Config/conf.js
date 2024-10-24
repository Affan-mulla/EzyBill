const conf = {
    Url: String(import.meta.env.VITE_APPWRITE_URL),        // The Appwrite endpoint URL
    ProjectId: String(import.meta.env.VITE_APPWRITE_PROJECTID), // Your Appwrite project ID
    BucketId: String(import.meta.env.VITE_APPWRITE_BUCKETID),   // Storage bucket ID (for files)
    DatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASEID), // Database ID
    customer: String(import.meta.env.VITE_APPWRITE_CUSTOMER),     // Customer collection ID
    product: String(import.meta.env.VITE_APPWRITE_PRODUCT),        // Product collection ID
    owner: String(import.meta.env.VITE_APPWRITE_OWNER),            // Owner collection ID
    dashboard: String(import.meta.env.VITE_APPWRITE_DASHBOARD),    // Dashboard URL or ID (if applicable)
}


export default conf