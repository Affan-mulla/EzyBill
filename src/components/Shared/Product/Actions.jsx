import React from 'react';
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from 'react-router-dom';
import { useDeleteCustomer, useDeleteProduct } from '@/lib/Query/queryMutation';
import { toast } from '@/hooks/use-toast';
import { useUserContext } from '@/Context/AuthContext';

const Actions = ({ productId, getData , action}) => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { mutateAsync: productDel } = useDeleteProduct();
  const {mutateAsync,isPending} = useDeleteCustomer()

  const deleteProduct = async () => {
    const deleted = await productDel(productId);

    if (!deleted) {
      return toast({
        variant: "destructive",
        title: 'OOPS...Something went wrong. Try again later.',
      });
    }

    await getData();
    return toast({
      title: 'Product deleted successfully.',
    });
  };

  const deleteCustomer = async()=> {
    const deleted = await mutateAsync(productId);

    if (!deleted) {
      return toast({
        variant: "destructive",
        title: 'OOPS...Something went wrong. Try again later.',
      });
    }
    return toast({
      title: 'Customer deleted successfully.',
    });
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to={`/edit-product/${productId}`} className={`${action == "customer" && 'hidden'}`}>
        <DropdownMenuItem>
          Edit
        </DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={deleteProduct} className={`${action == "customer" && 'hidden'}`}>Delete</DropdownMenuItem>
        <DropdownMenuItem onClick={deleteCustomer} className={`${action == "product" && 'hidden'}`}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Actions;
