import { formatCurrency } from '@/lib/utils/format';
import Actions from './Actions';

export const columns = [
  {
    header: 'Image',
    accessorKey: 'productImage',
    cell: ({ getValue }) => {
      const imageUrl = getValue();
      return (
        <div className="relative h-12 w-12 overflow-hidden rounded-lg border">
          <img
            src={imageUrl || '/assets/placeholder.svg'}
            alt="Product"
            className="h-full w-full object-cover transition-transform hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/assets/placeholder.svg';
            }}
          />
        </div>
      );
    },
  },
  {
    header: 'Product Name',
    accessorKey: 'productName',
    cell: ({ getValue }) => <div className="font-medium text-foreground">{getValue()}</div>,
  },
  {
    header: 'Description',
    accessorKey: 'description',
    cell: ({ getValue }) => {
      const description = getValue();
      return (
        <div className="max-w-xs truncate text-sm text-muted-foreground" title={description}>
          {description || <span className="italic text-muted-foreground/70">No description</span>}
        </div>
      );
    },
  },
  {
    header: 'Stock',
    accessorKey: 'Stock',
    cell: ({ getValue }) => {
      const stock = getValue();
      let className = 'font-semibold';

      if (stock === 0) {
        className += ' text-destructive';
      } else if (stock < 10) {
        className += ' text-yellow-600';
      } else {
        className += ' text-green-600';
      }

      return <div className={className}>{stock} units</div>;
    },
  },
  {
    header: 'Price',
    accessorKey: 'price',
    cell: ({ getValue }) => (
      <div className="font-semibold text-foreground">{formatCurrency(getValue())}</div>
    ),
  },
  {
    header: 'Actions',
    id: 'actions',
    accessorKey: '$id',
    cell: ({ getValue, row }) => (
      <Actions productId={getValue()} action="product" productData={row.original} />
    ),
  },
];
