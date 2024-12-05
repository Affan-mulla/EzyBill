
import DashboardPage from '@/components/Dashboard/Dash';
import ProfileNotify from '@/components/Shared/ProfileNotify';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { DatePickerWithPresets } from '@/components/ui/DatePicker';
import { useUserContext } from '@/Context/AuthContext';
import { useGetCustomers, useRecentSales } from '@/lib/Query/queryMutation';
import { IconEyeDollar, IconWorldDollar } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const { user } = useUserContext()
  const [dateRange, setDateRange] = useState('all'); // Default to 'all'
  const { data, isLoading, refetch, isFetching } = useGetCustomers(user?.id, dateRange);
  const [premium, setPremium] = useState(false)





  const changeDate = (newDate) => {
    if (newDate) {
      setDateRange(newDate);
    } else {
      setDateRange('all'); // Reset to 'all' if the date is null
    }
  };
  useEffect(() => {

    refetch();

  }, [dateRange]);



  let totalRevenue = 0;
  let totalSale = 0;
  let products = [];
  let topSellingProduct
  const getSale = (data) => {



    data?.map((row) => {
      products.push(...JSON.parse(row.productPurchased))
    })


    products.map((row) => {

      totalSale += row.quantity
    })



  }
  getSale(data)

  const productSales = products.reduce((acc, product) => {
    if (!acc[product.$id]) {
      acc[product.$id] = {
        productName: product.productName,
        price: product.price,
        productImage: product.productImage,
        totalStockSold: 0,
        timesSold: 0
      };
    }
    // Increment the count of times sold and sum stock
    acc[product.$id].totalStockSold += product.Stock;
    acc[product.$id].timesSold += product.quantity;

    return acc;
  }, {});

  if (productSales) {
    const sortedProducts = Object.values(productSales).sort((a, b) => {
      // First sort by timesSold in descending order, then by totalStockSold
      if (b.timesSold === a.timesSold) {
        return b.totalStockSold - a.totalStockSold;
      }
      return b.timesSold - a.timesSold;
    });

    // Step 3: The top-selling product is the one with the highest times sold (and highest quantity if there's a tie)
    topSellingProduct = sortedProducts[0];

  }




  data?.map((row) => {
    totalRevenue += row.totalSpent
  })




  return (

    premium ?
      (
        <div className='min-h-screen w-full md:px-8 px-4 py-3 dark:bg-neutral-950' >
          <div className='h-full w-full'>
            <div className='flex w-full justify-between items-center'>
              <ProfileNotify className='w-[50px]' />
              <DatePickerWithPresets onChangeDate={changeDate} />
            </div>

            <DashboardPage totalRevenue={totalRevenue} totalSale={totalSale} topSelling={topSellingProduct} data={data} dateRange={dateRange} />
          </div>
        </div>
      ) : (
        <div className='h-screen w-full px-8 py-5'>
          <div className='z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 '>
            <img src="public/assets/icons8-lock-80.png" alt="" width={150}/>  
          </div>
          <div className='flex z-50 border-2 dark:border border-blue-300 dark:bg-violet-950 bg-blue-400 h-full w-full relative dark:bg-opacity-30 bg-opacity-30 rounded-md justify-center items-center '>
            <h1 className='text-3xl font-bold tracking-tight dark:text-zinc-50 drop-shadow-xl text-neutral-950 text-center'>
              Buy the premium to get access of Dashboard.
            </h1>
          </div>
        </div>
      )

  );
};

export default Dashboard;
