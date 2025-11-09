import { motion } from 'framer-motion';
import { useState } from 'react';
import { customerColumn } from '@/components/Shared/Customer/CustomerColumn';
import { DataTable } from '@/components/Shared/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserContext } from '@/Context/AuthContext';
import { useGetCustomers } from '@/lib/Query/queryMutation';
import { ProductTableSkeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Customer = () => {
  const [dateRange, setDateRange] = useState('all');
  const { user } = useUserContext();
  const { data: customers, isLoading, error, refetch } = useGetCustomers(user?.id, dateRange);

  const handleDateChange = (newDate) => {
    setDateRange(newDate || 'all');
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full gap-4 p-8"
      >
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h3 className="text-lg font-semibold">Failed to load customers</h3>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full flex md:px-8 px-4 py-4 w-full dark:bg-neutral-950 flex-col gap-4"
    >
      {isLoading ? (
        <ProductTableSkeleton rows={5} />
      ) : (
        <Card className="h-full md:px-8 md:py-5 px-2 py-3 w-full shadow-sm dark:shadow-none">
          <CardHeader className="px-2">
            <CardTitle className="md:text-3xl text-2xl tracking-tight">
              Customers
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage customer invoices and transactions.
            </p>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={customerColumn}
              data={customers || []}
              isLoading={isLoading}
              filterColumn="customerName"
              filterPlaceholder="Search customers by name..."
              showDateFilter={true}
              onDateChange={handleDateChange}
              pageSize={10}
              emptyMessage="No customer records found."
            />
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default Customer;
