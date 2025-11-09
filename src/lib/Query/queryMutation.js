import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import authService from "../appWrite/api";
import { toast } from "@/hooks/use-toast";

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
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({userId, productName, stock, price, images, description}) => 
      authService.createProduct({userId, productName, stock, price, images, description}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PRODUCTS] });
      toast({
        title: "Success",
        description: "Product created successfully!",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create product",
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });
}

export const useGetProduct = (userId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PRODUCTS, userId],
    queryFn: () => authService.getProduct(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to fetch products",
        description: error.message || "Unable to load products.",
      });
    },
  });
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productId) => authService.deleteProduct(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_PRODUCTS] });
      const previousProducts = queryClient.getQueryData([QUERY_KEYS.GET_PRODUCTS]);
      
      queryClient.setQueryData([QUERY_KEYS.GET_PRODUCTS], (old) =>
        old?.filter((p) => p.$id !== productId)
      );
      
      return { previousProducts };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData([QUERY_KEYS.GET_PRODUCTS], context?.previousProducts);
      toast({
        variant: "destructive",
        title: "Failed to delete product",
        description: err.message || "Something went wrong. Please try again.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Product deleted",
        description: "Product has been removed successfully.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PRODUCTS] });
    },
  });
}

export const useGetProductById = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PRODUCT_BY_ID,id],
    queryFn: ()=> authService.getProductById(id),
  })
}
export const useEditProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({userId, productName, stock, price, images, description, imageId, imageUrl, productId}) => 
      authService.updateProduct({userId, productName, stock, price, images, description, imageId, imageUrl, productId}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PRODUCTS] });
      toast({
        title: "Success",
        description: "Product updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update product",
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });
}

export const useSaveCustomer = () => {
  return useMutation({
    mutationFn: (data) => authService.saveCustomerBill(data)
  })
}

export const useGetCustomers = (ownerId, dateRange = "all") => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CUSTOMERS, ownerId, dateRange],
    queryFn: () => authService.getCustomers(ownerId, dateRange),
    enabled: !!ownerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to fetch customers",
        description: error.message || "Unable to load customer data.",
      });
    },
  });
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
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (customerId) => authService.deleteCustomer(customerId),
    onMutate: async (customerId) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_CUSTOMERS] });
      const previousCustomers = queryClient.getQueryData([QUERY_KEYS.GET_CUSTOMERS]);
      
      queryClient.setQueryData([QUERY_KEYS.GET_CUSTOMERS], (old) =>
        old?.filter((c) => c.$id !== customerId)
      );
      
      return { previousCustomers };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData([QUERY_KEYS.GET_CUSTOMERS], context?.previousCustomers);
      toast({
        variant: "destructive",
        title: "Failed to delete customer",
        description: err.message || "Something went wrong. Please try again.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Customer deleted",
        description: "Customer record has been removed successfully.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CUSTOMERS] });
    },
  });
}