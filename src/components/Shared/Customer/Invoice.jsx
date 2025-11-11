import { forwardRef } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const InvoicePreview = forwardRef(
  (
    {
      user,
      selectedRows,
      customerName,
      paymentMethod,
      purchaseDate,
      total,
      subtotal,
      tax,
      addTax,
      invoiceID,
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        className="w-full print:w-[210mm] print:h-auto print:shadow-none print:border-gray-200 print:bg-white border border-border bg-card/90 rounded-xl shadow-md overflow-hidden transition-all duration-300"
      >
        <CardHeader className="flex flex-col items-center border-b border-border print:border-gray-300 pb-1">
          <img
            src={user.imageUrl}
            alt="Shop Logo"
            className="rounded-full border-2 border-primary shadow-md mb-3 print:border-gray-400 w-14 h-14 object-cover"
          />
          <CardTitle className="text-2xl font-bold text-foreground print:text-black">
            {user.shopName || 'Shop Name'}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1 print:text-gray-600 text-center">
            {user.address || 'Shop Address'}
          </p>
        </CardHeader>

        <div className="grid grid-cols-2 gap-4 sm:gap-8 p-3 border-b border-border print:border-gray-300">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Invoice Number</p>
            <h2 className="text-lg font-semibold text-foreground">INV-{invoiceID}</h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Date</p>
            <h2 className="text-base font-medium text-foreground">{purchaseDate}</h2>
          </div>
        </div>

        <div className="p-3 bg-muted/30 print:bg-gray-100 rounded-none border-b border-border print:border-gray-300">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Bill To</p>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            {customerName || 'Customer Name'}
          </h2>
        </div>

        <div className="p-3">
          <table className="w-full border border-border print:border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-accent/20 print:bg-gray-200">
              <tr className="border-b border-border print:border-gray-300">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Product Name</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Qty</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Price</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Total</th>
              </tr>
            </thead>
            <tbody className="bg-background print:bg-white">
              {selectedRows.length > 0 ? (
                selectedRows.map((product) => (
                  <tr
                    key={product.$id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 print:hover:bg-transparent transition"
                  >
                    <td className="py-3 px-4 text-sm text-foreground">{product.productName}</td>
                    <td className="text-right py-3 px-4 text-sm text-foreground">{product.quantity}</td>
                    <td className="text-right py-3 px-4 text-sm text-foreground">₹{product.price}</td>
                    <td className="text-right py-3 px-4 text-sm font-semibold text-foreground">
                      ₹{(product.price * product.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-muted-foreground text-sm">
                    No products selected.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 pb-3">
          <div className="flex flex-col items-end gap-1 text-sm">
            <div className="flex justify-between w-full sm:w-1/2">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">₹{subtotal.toFixed(2)}</span>
            </div>

            {addTax && (
              <div className="flex justify-between w-full sm:w-1/2">
                <span className="text-muted-foreground">Tax (18%)</span>
                <span className="font-medium text-foreground">₹{tax.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between w-full sm:w-1/2 border-t border-border mt-3 pt-2">
              <span className="text-base font-bold text-foreground">Total Amount</span>
              <span className="text-lg font-bold text-primary">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mx-6 mb-3 p-3 bg-accent/20 print:bg-gray-100 rounded-md border border-border print:border-gray-300">
          <p className="text-sm text-foreground">
            <span className="text-muted-foreground">Payment Method: </span>
            <span className="font-semibold">{paymentMethod || 'Not Provided'}</span>
          </p>
        </div>

        <div className="text-center border-t border-border print:border-gray-300 py-1.5">
          <p className="text-base font-semibold text-foreground print:text-black">
            Thank you for your purchase!
          </p>
          <p className="text-sm text-muted-foreground print:text-gray-600">
            We appreciate your business and hope to see you again.
          </p>
        </div>
      </Card>
    );
  }
);

export default InvoicePreview;
