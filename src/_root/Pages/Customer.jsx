import { motion } from 'framer-motion';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { customerColumns } from '@/components/Shared/Customer/CustomerColumnDefinitions';
import { DataTable } from '@/components/Shared/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductTableSkeleton } from '@/components/ui/skeleton';
import { useUserContext } from '@/Context/AuthContext';
import { useGetCustomers } from '@/lib/Query/queryMutation';

const Customer = () => {
  const [dateRange, setDateRange] = useState('all');
  const { user } = useUserContext();
  const { data: customers, isLoading, error, refetch } = useGetCustomers(user?.id, dateRange);

  const newData = customers?.map((customer) => ({
    productPurchased: customer.productPurchased,
    InvoiceNo: customer.InvoiceNo,
    date: customer.date,
    paymentMethod: customer.paymentMethod,
    customerName: customer.customerName,
    $id: customer.$id,
    totalSpent: customer.totalSpent,
  }));

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
      className="h-full flex md:px-6 p-4 w-full flex-col gap-4"
    >
      {isLoading ? (
        <ProductTableSkeleton rows={5} />
      ) : (
        <Card className="h-full w-full shadow-sm dark:shadow-none">
          <CardHeader>
            <CardTitle className="md:text-3xl text-2xl tracking-tight">Customers</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage customer invoices and transactions.
            </p>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={customerColumns}
              data={newData || []}
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
