"use client"
import { ID } from "appwrite";
import Actions from "./../Product/Actions";

export const customerColumn = (fetchData) => [
  {
    header: "Invoice ID",
    accessorKey: "InvoiceNo",  // Ensure this key matches your data's image field
    cell: ({ getValue }) => getValue(),
  },
  {
    header: "Customer Name",
    accessorKey: "customerName",
    cell: ({ getValue }) => getValue(),  // Simple text cell for product name
  },
  {
    header: "Item Purchased",
    accessorKey: "productPurchased",
    cell: ({ getValue }) => {
      const products = JSON.parse(getValue())
      return products.map((row) => (
        <p key={ID.unique()}>{row.productName}×{row.quantity}</p>
      ))
    },
  },
  {
    header: "Payment Method",
    accessorKey: "paymentMethod",
    cell: ({ getValue }) => getValue(),
  },
  {
    header: "Total",
    accessorKey: "totalSpent",
    cell: ({ getValue }) => `₹${getValue()}`,  // Format price with currency
  },
  {
    header: "Date of purchased",
    accessorKey: "date",
    cell: ({ getValue }) => getValue(),
  },

  {
    header: 'Actions',
    id: "actions",
    accessorKey: "$id",
    cell: ({ getValue }) => {

      return (
        <Actions productId={getValue()} getData={fetchData} action={'customer'}/>
      )
    },
  },
];
