import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import DemoPage from '@/components/Shared/Product/Page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Products = () => {
  return (
    <div className="h-full flex md:px-8 px-4 py-6 w-full flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col h-full gap-6"
      >
        <Card className="h-full bg-card border-border shadow-md dark:shadow-lg rounded-lg flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center px-6 py-5 justify-between border-b border-border bg-muted/20">
            <div className="space-y-1.5">
              <CardTitle className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Products
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your products and keep track of stocks.
              </p>
            </div>
            <Link to="/add-product">
              <Button className="gap-2 h-10 px-4 shadow-sm hover:shadow transition-all duration-200">
                <PlusCircle size={18} />
                Add Product
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <DemoPage />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Products; 