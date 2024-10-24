import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { ID } from 'appwrite'
import { useUserContext } from '@/Context/AuthContext'
import { useRecentSales } from '@/lib/Query/queryMutation'
import Loader from '../ui/Loader'

const Recent = () => {

  const { user } = useUserContext()
  const { data, isLoading } = useRecentSales(user.id)
  return (
    <div>
      {isLoading ? (
        <div className='flex justify-center items-center'>
          <Loader />
        </div>) : (
        <Table >
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>


            {data?.map((row) => (
              <TableRow key={ID.unique()}>
                <TableCell>{row?.customerName}</TableCell>

                {(() => {
                  const products = JSON.parse(row.productPurchased);
                  return products.map((product, index) => (
                    <TableCell key={index}>
                      {product.productName}
                      {index < products.length - 1 && ', '}
                    </TableCell>
                  ));
                })()}

                <TableCell>₹{row?.totalSpent}</TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>
      )}
    </div>
  )
}

export default Recent