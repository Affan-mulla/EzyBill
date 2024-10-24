import React, { forwardRef } from 'react'

const InvoicePreview = forwardRef(({ user, selectedRows, customerName, paymentMethod, purchaseDate, total, subtotal, tax, addTax, invoiceID},ref) => {
    

    return (
        <div ref={ref} className="py-4 px-6 flex-1 bg-zinc-100 rounded-md text-black">
            {/* Shop Details */}
            <div className="w-full flex justify-center items-center">
                <img src={user.imageUrl} alt="Shop Logo" className="rounded-full" width={50} />
            </div>
            <div className='text-lg font-medium mt-2'>
                INV-{invoiceID} 
            </div>
            <div className="flex justify-between items-center my-4">
                <div>
                    <p>From</p>
                    <h1 className="text-xl font-bold">{user.shopName}</h1>
                    <p>{user.shopAddress}</p> {/* Optionally include shop address */}
                </div>
                <div className="text-right">
                    <p>Date</p>
                    <h1>{purchaseDate}</h1>
                </div>
            </div>

            {/* Customer Details */}
            <div className="mb-4">
                <p>To</p>
                <h1 className="text-xl font-bold">{customerName || 'Customer Name'}</h1>
            </div>

            {/* Product List */}
            <table className="w-full mb-4 border-collapse">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-2">Product Name</th>
                        <th className="text-right py-2">Quantity</th>
                        <th className="text-right py-2">Price</th>
                        <th className="text-right py-2">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedRows.map((product, index) => (
                        <tr key={product.$id} className="border-b">
                            <td className="py-2">{product.productName}</td>
                            <td className="text-right py-2">{product.quantity}</td>
                            <td className="text-right py-2">₹{product.price}</td>
                            <td className="text-right py-2">₹{product.price * product.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Payment Summary */}
            <div className="text-right mb-4">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {addTax ? (
                    <div className="flex justify-between">
                    <span>Tax (18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                </div>
                ) : (<></>)}
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
            </div>

            {/* Payment Method */}
            <div className="mb-4">
                <p>Payment Method: {paymentMethod || 'Not Provided'}</p>
            </div>

            {/* Footer */}
            <div className="text-center border-t pt-4">
                <p>Thank you for your purchase!</p>
                <p>We hope to see you again.</p>
            </div>
        </div>
    );
});

export default InvoicePreview