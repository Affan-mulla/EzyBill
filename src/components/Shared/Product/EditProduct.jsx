import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import AddProductForm from './AddProductForm';
import { useGetProductById } from '@/lib/Query/queryMutation';
import { FormSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useGetProductById(id);

  if (isLoading) {
    return (
      <div className="h-full md:px-[100px] p-5">
        <FormSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full md:px-[100px] p-2 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-4"
        >
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h3 className="text-lg font-semibold">Failed to load product</h3>
          <p className="text-sm text-muted-foreground">
            {error?.message || 'An error occurred while loading the product'}
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate('/products')}>
              Back to Products
            </Button>
            <Button onClick={() => refetch()}>
              <Loader2 className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full md:px-[100px] p-2">
      <AddProductForm action="edit" currentData={data} />
    </div>
  );
};

export default EditProduct;