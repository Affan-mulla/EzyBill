import { useUserContext } from "@/Context/AuthContext";
import { useGetProduct } from "@/lib/Query/queryMutation";
import { ProductTableSkeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/Shared/DataTable";
import { columns } from "./Coloumn";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const DemoPage = () => {
  const { user } = useUserContext();
  const { data: products, isLoading, error, refetch } = useGetProduct(user?.id);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 gap-4"
      >
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h3 className="text-lg font-semibold">Failed to load products</h3>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </motion.div>
    );
  }

  if (isLoading) {
    return <ProductTableSkeleton rows={5} />;
  }

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={products || []}
        isLoading={isLoading}
        filterColumn="productName"
        filterPlaceholder="Search products by name..."
        showDateFilter={false}
        pageSize={10}
        emptyMessage="No products found. Start by adding your first product!"
      />
    </div>
  );
};

export default DemoPage;
