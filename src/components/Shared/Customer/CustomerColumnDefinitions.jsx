/**
 * Enhanced Customer Column Definitions
 * Features better formatting, accessibility, and visual feedback
 */

import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { Badge } from '@/components/ui/badge';
import { ID } from "appwrite";
import Actions from "../Product/Actions";

export const customerColumns = [
  {
    header: "Invoice ID",
    accessorKey: "InvoiceNo",
    cell: ({ getValue }) => (
      <div className="font-mono font-medium text-foreground">
        #{getValue()}
      </div>
    ),
  },
  {
    header: "Customer Name",
    accessorKey: "customerName",
    cell: ({ getValue }) => (
      <div className="font-medium text-foreground">
        {getValue()}
      </div>
    ),
  },
  {
    header: "Items Purchased",
    accessorKey: "productPurchased",
    cell: ({ getValue }) => {
      try {
        const products = JSON.parse(getValue());
        return (
          <div className="flex flex-col gap-1">
            {products.map((product) => (
              <div
                key={ID.unique()}
                className="text-sm text-muted-foreground"
              >
                <span className="font-medium text-foreground">
                  {product.productName}
                </span>
                {" × "}
                <span className="font-semibold">
                  {product.quantity}
                </span>
              </div>
            ))}
          </div>
        );
      } catch (error) {
        return <span className="italic text-muted-foreground">Invalid data</span>;
      }
    },
  },
  {
    header: "Payment Method",
    accessorKey: "paymentMethod",
    cell: ({ getValue }) => {
      const method = getValue();
      const methodColors = {
        cash: "default",
        card: "secondary",
        upi: "success",
        online: "info",
      };

      return (
        <Badge variant={methodColors[method?.toLowerCase()] || "default"}>
          {method}
        </Badge>
      );
    },
  },
  {
    header: "Total",
    accessorKey: "totalSpent",
    cell: ({ getValue }) => (
      <div className="font-semibold text-lg text-foreground">
        {formatCurrency(getValue())}
      </div>
    ),
  },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ getValue }) => (
      <div className="text-sm text-muted-foreground">
        {formatDateTime(getValue())}
      </div>
    ),
  },
  {
    header: "Actions",
    id: "actions",
    accessorKey: "$id",
    cell: ({ getValue, row }) => (
      <Actions
        productId={getValue()}
        action="customer"
        customerData={row.original}
      />
    ),
  },
];
