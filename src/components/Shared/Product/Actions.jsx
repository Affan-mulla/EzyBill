import React from 'react';
import { Loader2, Pen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from 'react-router-dom';
import { useDeleteCustomer, useDeleteProduct } from '@/lib/Query/queryMutation';
import { toast } from '@/hooks/use-toast';
import { useUserContext } from '@/Context/AuthContext';

const Actions = ({ productId, getData, action }) => {
  const { user } = useUserContext();
  const { mutateAsync: deleteProductMutation } = useDeleteProduct();
  const { mutateAsync: deleteCustomerMutation, isPending } = useDeleteCustomer();

  const handleDeleteProduct = async () => {
    const deleted = await deleteProductMutation(productId);
    if (!deleted) {
      return toast({
        variant: "destructive",
        title: "Oops! Something went wrong.",
        description: "Try again later.",
      });
    }
    await getData?.();
    toast({
      title: "Product deleted successfully.",
    });
  };

  const handleDeleteCustomer = async () => {
    const deleted = await deleteCustomerMutation(productId);
    if (!deleted) {
      return toast({
        variant: "destructive",
        title: "Oops! Something went wrong.",
        description: "Try again later.",
      });
    }
    toast({
      title: "Customer deleted successfully.",
    });
  };

  return (
    <div className="flex items-center gap-1">
      {/* Edit Button (only for product) */}
      {action === "product" && (
        <Link to={`/edit-product/${productId}`}>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Pen size={16} strokeWidth={2} />
          </Button>
        </Link>
      )}

      {/* Delete Button with Confirmation */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            {isPending ? (
              <Loader2 className="animate-spin h-4 w-4 text-muted-foreground" />
            ) : (
              <Trash2 size={16} strokeWidth={2} />
            )}
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="max-w-sm border border-border bg-card/95 backdrop-blur-sm shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-foreground">
              Delete {action === "product" ? "Product" : "Customer"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to delete this {action}? This action cannot be undone and will permanently remove all related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-2 pt-4">
            <AlertDialogCancel className="border-border bg-muted/40 hover:bg-muted/60 transition-colors">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={action === "product" ? handleDeleteProduct : handleDeleteCustomer}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              {isPending ? (
                <Loader2 className="animate-spin h-4 w-4 mr-1" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Actions;
