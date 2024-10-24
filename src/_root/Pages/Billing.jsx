import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loader from '@/components/ui/Loader';
import { useUserContext } from '@/Context/AuthContext';
import { useGetProduct, useSaveCustomer } from '@/lib/Query/queryMutation';
import { IconCheck, IconMinus, IconPlus } from '@tabler/icons-react';
import React, { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Watch } from 'lucide-react';
import InvoicePreview from '@/components/Shared/Customer/Invoice';
import { useReactToPrint } from 'react-to-print';
import { Toast } from '@/components/ui/toast';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

// Quantity Counter component for reusability
const QuantityCounter = ({ index, quantity, onIncrease, onDecrease }) => (
  <div className="flex items-center gap-2 dark:bg-neutral-950 bg-zinc-100">
    <div className='bg-violet-600 p-1 rounded-md text-zinc-100 transition-all duration-150 hover:bg-violet-500 cursor-pointer'
      onClick={() => onDecrease(index)}
    >
      <IconMinus />
    </div>
    <span className="px-2">{quantity}</span>
    <div
      className='bg-violet-600 p-1 rounded-md text-zinc-100 cursor-pointer hover:bg-violet-500 transition-all duration-150'
      
      onClick={() => onIncrease(index)}
    >
      <IconPlus />
    </div>
  </div>
);

const Billing = () => {
  const { user } = useUserContext();
  const navigate = useNavigate()
  const { data: allProducts, isLoading } = useGetProduct(user.id);
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [payment, setPayment] = useState();
  const [tax, setTax] = useState(false);

  const generateShortInvoiceId = () => {
    const timestamp = Date.now().toString().slice(-5); // Get last 5 digits of timestamp
    const randomPart = Math.floor(Math.random() * 100); // Random number (0-99)
    return `${timestamp}${randomPart}`; // Example: 'INV2345612'
  };

  const [invoiceID, setInvoiceId] = useState(generateShortInvoiceId())
  const { mutateAsync: saveCustomer, isPending } = useSaveCustomer();

  // Watch for changes in customerName field
  const customerName = watch('customerName');

  useEffect(() => {
    setQuantities(() => allProducts?.map(() => 1) || []);
  }, [allProducts]);

  const updateSelectedRowQuantity = (productId, newQuantity) => {
    setSelectedRows(prev =>
      prev.map(item =>
        item.$id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleIncrease = (index) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index] += 1;
    setQuantities(updatedQuantities);

    const product = allProducts[index];
    if (selectedRows.some(item => item.$id === product.$id)) {
      updateSelectedRowQuantity(product.$id, updatedQuantities[index]);
    }
  };

  const handleDecrease = (index) => {
    const updatedQuantities = [...quantities];
    if (updatedQuantities[index] > 1) {
      updatedQuantities[index] -= 1;
      setQuantities(updatedQuantities);

      const product = allProducts[index];
      if (selectedRows.some(item => item.$id === product.$id)) {
        updateSelectedRowQuantity(product.$id, updatedQuantities[index]);
      }
    }
  };

  const handleCheckboxChange = ({ productName, price, $id, productImage, Stock }, index, isChecked) => {
    const productWithQuantity = { productName, price, $id, productImage, Stock, quantity: quantities[index] };

    if (isChecked) {
      setSelectedRows(prev => [...prev, productWithQuantity]);
    } else {
      setSelectedRows(prev => prev.filter(item => item.$id !== $id));
    }
  };

  const handleReset = () => {
    reset();
    setSelectedRows([]);
    setPayment();
    setInvoiceId();
    return
  }

  if (!invoiceID) {
    setInvoiceId(generateShortInvoiceId())
  }
  // Example date from Appwrite (stored in UTC)
  const appwriteDate = new Date();

  // Convert to local time zone (IST)
  const istOffset = 5.5 * 60; // IST is UTC +5:30
  const istDate = new Date(appwriteDate.getTime() + istOffset * 60000);

 

  async function onSubmit(data) {

    const formData = {
      ...data, // form data (e.g., customer name, purchase date, payment method)
      total: total,
      paymentMethod: payment,
      invoiceId: invoiceID,
      userId: user.id,
      selectedProducts: selectedRows
    };

    const savedCustomer = await saveCustomer(formData);
    if (!savedCustomer) {
      return toast({
        variant: 'destructive',
        title: 'OPPSS... Something went wrong please try again.'
      })
    }
    setInvoiceId();
    reset();
    setSelectedRows([]);
    setPayment();
    return reset();

  }

  // Calculate subtotal and total
  let subtotal = selectedRows.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  let Tax = 0;

  if (tax) {
    Tax = subtotal * 0.18; // Example tax rate of 18%
  }
  const total = subtotal + Tax;

  const invoiceRef = useRef(null)

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    onBeforePrint: handleSubmit(onSubmit)
  })




  return (
    <div className="flex min-h-screen flex-col dark:bg-neutral-950 bg-zinc-50  gap-4 sm:flex-row px-4 py-4 md:px-8">
      <div className="flex-[2]  flex-col w-full p-4 md:py-5 rounded-md border">
        <h1 className="md:text-3xl text-2xl tracking-tight mb-4">Invoice Details</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex-1">
            <Label className="dark:text-zinc-400 text-neutral-800">Customer Name</Label>
            <Input {...register("customerName", { required: true })} placeholder="Customer Name" />
            {errors.customerName && <p className="text-red-500">Customer name is required.</p>}
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label className="dark:text-zinc-400 text-neutral-800">Date of Purchase</Label>
              <Input defaultValue={istDate.toISOString()} {...register('purchaseDate')} readOnly />
            </div>

            <div className="flex-1">
              <Label className="dark:text-zinc-400 text-neutral-800">Mode of Payment</Label>
              <Select onValueChange={setPayment}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Google Pay Upi">Google Pay Upi</SelectItem>
                  <SelectItem value="Phone Pay Upi">Phone Pay Upi</SelectItem>
                  <SelectItem value="Bharat Pay Upi">Bharat Pay Upi</SelectItem>
                  <SelectItem value="Paytm">Paytm</SelectItem>
                  <SelectItem value="Net Banking">Net Banking</SelectItem>
                </SelectContent>
              </Select>
              {errors.paymentMethod && <p className="text-red-500">Payment method is required.</p>}
            </div>
          </div>

          {/* Products Section */}
          <div className="dark:bg-neutral-950 p-3 rounded-md border">
            <h1 className="md:text-3xl text-2xl tracking-tight mb-4">Products</h1>
            <Card className=" rounded-md border max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <Loader />
              ) : (
                allProducts?.map((product, index) => (
                  <div key={product.$id} className="flex dark:text-zinc-200  tracking-tight font-medium items-center justify-between px-2 py-2  border-b last:border-0">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="hidden peer" onChange={(e) => handleCheckboxChange(product, index, e.target.checked)} />
                      <span className="w-5 h-5 bg-transparent border-2 border-zinc-300 rounded text-transparent  peer-checked:text-violet-500  flex items-center justify-center transition-all">
                        <IconCheck className='font-bold'/>
                      </span>
                    </label>

                    <img src={product.productImage} width={50} alt={product.productName} className="rounded-full" />
                    <div>{product.productName}</div>
                    <div>₹{product.price}</div>
                    <QuantityCounter
                      index={index}
                      quantity={quantities[index]}
                      onIncrease={handleIncrease}
                      onDecrease={handleDecrease}
                    />
                  </div>
                ))
              )}
            </Card>
          </div>



          <div className="w-full flex gap-2 justify-center items-center">
            <div className='min-w-fit'>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="hidden peer" onClick={() => setTax(!tax)} />
                <span className="w-5 h-5 bg-transparent border-2 border-zinc-200 rounded text-transparent peer-checked:text-violet-600 flex items-center justify-center transition-all">
                  <IconCheck />
                </span>
                <p>Add Tax</p>
              </label>
            </div>

            <div className='w-full flex gap-4 justify-end md:justify-start'>
              <div className='px-4 py-2 cursor-pointer dark:bg-neutral-950 rounded-md border' onClick={handleReset}>Cancel</div>
              <Button type="submit" size="lg">{isPending ? (<Loader />) : 'Save'}</Button>
              <div onClick={handlePrint}  className='bg-violet-600  rounded-md text-zinc-50 text-center hover:bg-violet-800 transition-all duration-150 px-4 flex justify-center items-center font-medium cursor-pointer'>{isPending ? (<Loader/> ): "Print & Save"}</div>
            </div>
          </div>
        </form>
      </div>

      {/* Invoice Preview */}
      <InvoicePreview
        ref={invoiceRef}
        user={user}
        selectedRows={selectedRows}
        customerName={customerName}
        paymentMethod={payment}
        purchaseDate={new Date().toLocaleDateString()}
        total={total}
        subtotal={subtotal}
        tax={Tax}
        addTax={tax}
        invoiceID={invoiceID}
      />

    </div>
  );
};


export default Billing;
