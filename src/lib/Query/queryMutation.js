import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
// import { QUERY_KEYS } from "./queryKey";
import authService from "../appWrite/api";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: ({ name, email, shopName, password, phone }) =>
      authService.createUser({ name, email, shopName, password, phone }),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: ({ email, password }) =>
      authService.signInAccount({ email, password }),
  });
};

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: ({userId, productName, stock, price, images, description}) => 
      authService.createProduct({userId, productName, stock, price, images, description})
  })
}

export const useGetProduct = (userId) => {
  return useQuery({
    queryKey : [QUERY_KEYS.GET_PRODUCTS, userId],
    queryFn : () => authService.getProduct(userId)
  })
}

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn : (productId) => authService.deleteProduct(productId),
  })
}

export const useGetProductById = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PRODUCT_BY_ID,id],
    queryFn: ()=> authService.getProductById(id),
  })
}
export const useEditProduct = () => {
  return useMutation({
    mutationFn: ({userId, productName, stock, price, images, description ,imageId, imageUrl, productId}) => 
      authService.updateProduct({userId, productName, stock, price, images, description, imageId, imageUrl, productId})
  })
}

export const useSaveCustomer = () => {
  return useMutation({
    mutationFn: (data) => authService.saveCustomerBill(data)
  })
}

export const useGetCustomers = (ownerId,date) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CUSTOMERS,ownerId],
    queryFn: ()=> authService.getCustomers(ownerId,date)
  })
}

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (data)=> authService.updateProfile(data)
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: ()=> authService.logout()
  })
}

export const useRecentSales = (userId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CUSTOMERS],
    queryFn: ()=> authService.recentSales(userId)
  })
}

export const useDeleteCustomer = () => {
  return useMutation({
    mutationFn : (CID) => authService.deleteCustomer(CID),
  })
}