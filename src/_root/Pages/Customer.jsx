import { customerColumn } from '@/components/Shared/Customer/CustomerColumn';
import { DataTable } from '@/components/Shared/Product/DataTable';
import ProfileNotify from '@/components/Shared/ProfileNotify';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUserContext } from '@/Context/AuthContext';
import { useGetCustomers } from '@/lib/Query/queryMutation';

import React, { useEffect, useState } from 'react';
import { DatePickerWithPresets } from '@/components/ui/DatePicker';
import Loader from '@/components/ui/Loader';

const Customer = () => {
  const [dateRange, setDateRange] = useState('all'); // Default to 'all'
  const { user } = useUserContext();
  const { data, isLoading, refetch, isFetching } = useGetCustomers(user?.id, dateRange);

  const changeDate = (newDate) => {
    if (newDate) {
      setDateRange(newDate);
    
      
    } else {
      setDateRange('all'); // Reset to 'all' if the date is null
    }
  };

  // Refetch customers when the date range changes
  useEffect(() => {
   
      refetch();
    
  }, [dateRange]); // Refetch when date range or user changes

  return (
    <div className='min-h-screen h-full flex md:px-8 px-4 py-4 w-full dark:bg-neutral-950 flex-col gap-4 items-center'>
      <div className='h-fit flex md:justify-between w-full gap-4 items-center'>
        
        <ProfileNotify className={'w-[50px]'}/>
      </div>

      { isLoading ? (
        <Loader />
      ) : (
        <Card className='h-full md:px-8 md:py-5 px-4 py-3 w-full '>
        <CardTitle className='md:text-3xl text-2xl tracking-tight'>Customers</CardTitle>
        <CardContent className=''>
          
            <DataTable 
              columns={customerColumn} 
              data={data} 
              filterName={'customerName'} 
              DateChange={changeDate} // Pass down the DateChange function
              dateFilter={true}
            />
          
        </CardContent>
      </Card>
      )}
    </div>
  );
};

export default Customer;
