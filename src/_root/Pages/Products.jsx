import { motion } from 'framer-motion';
import DemoPage from '@/components/Shared/Product/Page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const Products = () => {
  return (
    <div className="h-full flex md:px-8 px-4 py-4 w-full dark:bg-neutral-950 flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col h-auto gap-4"
      >
        <Card className="h-full px-4 py-2 rounded-md border shadow-sm dark:shadow-none flex flex-col">
          <CardHeader className="flex flex-row items-center mb-2 px-0 justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold tracking-tight md:text-3xl dark:text-zinc-50">
                Products
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your products and keep track of stocks.
              </p>
            </div>
            <Link to="/add-product">
              <Button>
                <PlusCircle size={20}  className='mr-2'/>
                Add Product
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="px-0">
            <DemoPage />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Products; 