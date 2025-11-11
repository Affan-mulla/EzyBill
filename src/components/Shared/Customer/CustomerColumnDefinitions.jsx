import { ID } from 'appwrite';
import { formatCurrency, formatIST } from '@/lib/utils/format';
import { Badge } from '@/components/ui/badge';
import Actions from '../Product/Actions';

export const customerColumns = [
  {
    header: 'Invoice ID',
    accessorKey: 'InvoiceNo',
    cell: ({ getValue }) => (
      <div className="font-mono font-medium text-foreground">#{getValue()}</div>
    ),
  },
  {
    header: 'Customer Name',
    accessorKey: 'customerName',
    cell: ({ getValue }) => <div className="font-medium text-foreground">{getValue()}</div>,
  },
  {
    header: 'Items Purchased',
    accessorKey: 'productPurchased',
    cell: ({ getValue }) => {
      try {
        const products = JSON.parse(getValue());
        return (
          <div className="flex flex-col gap-1">
            {products.map((product) => (
              <div key={ID.unique()} className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{product.productName}</span>
                {' × '}
                <span className="font-semibold">{product.quantity}</span>
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
    header: 'Payment Method',
    accessorKey: 'paymentMethod',
    cell: ({ getValue }) => {
      const method = getValue();
      return <Badge variant="default">{method}</Badge>;
    },
  },
  {
    header: 'Total',
    accessorKey: 'totalSpent',
    cell: ({ getValue }) => (
      <div className="font-semibold text-lg text-foreground">{formatCurrency(getValue())}</div>
    ),
  },
  {
    header: 'Date',
    accessorKey: 'purchaseDate',
    cell: ({ row, getValue }) => {
      const raw = getValue() || row.original?.date || row.original?.purchaseDateISO;
      let display = 'N/A';

      if (raw) {
        display = typeof raw === 'string' && raw.includes('T') ? formatIST(raw) : raw;
      }
      return <div className="text-sm font-medium text-foreground">{display}</div>;
    },
  },
  {
    header: 'Actions',
    id: 'actions',
    accessorKey: '$id',
    cell: ({ getValue, row }) => (
      <Actions productId={getValue()} action="customer" customerData={row.original} />
    ),
  },
];
