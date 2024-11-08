"use client"

import Actions from "./Actions";


export const columns = (fetchData)=> [
  {
    header: "Image",
    accessorKey: "productImage",  // Ensure this key matches your data's image field
    cell: ({ getValue }) => (
      <img src={getValue()} alt="public/assets/placeholder.svg" width={50}  className=" object-cover rounded-full aspect-square" />
    ),  // Render image
  },
  {
    header: "Product Name",
    accessorKey: "productName",
    cell: ({ getValue }) => getValue(),  // Simple text cell for product name
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: ({ getValue }) => getValue(),
  },
  {
    header: "Stock",
    accessorKey: "Stock",
    cell: ({ getValue }) => getValue(),
  },
  {
    header: "Price",
    accessorKey: "price",
    cell: ({ getValue }) => `₹${getValue()}`,  // Format price with currency
  },
  
  {
    header: 'Actions',
    id: "actions",
    accessorKey: "$id",
    cell: ({ getValue }) => {
 
      return (
        <Actions productId={getValue() } getData={fetchData}  action={'product'}/>
      )
    },
  },
];
