import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { IconCheck, IconMinus, IconPlus } from '@tabler/icons-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loader from '@/components/ui/Loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InvoicePreview from '@/components/Shared/Customer/Invoice';
import { useUserContext } from '@/Context/AuthContext';
import { useGetProduct, useSaveCustomer } from '@/lib/Query/queryMutation';
import { toast } from '@/hooks/use-toast';
import { formatIST } from '@/lib/utils/format';

const QuantityCounter = ({ index, quantity, onIncrease, onDecrease }) => (
  <div className="flex items-center gap-2 bg-muted/50 rounded-md h-fit w-fit border border-border">
    <button
      type="button"
      className='bg-primary p-1.5 rounded-l-md text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
      onClick={() => onDecrease(index)}
      disabled={quantity <= 1}
    >
      <IconMinus size={16} strokeWidth={2.5} />
    </button>
    <span className="px-3 min-w-8 text-center text-sm font-semibold text-foreground">{quantity}</span>
    <button
      type="button"
      className='bg-primary p-1.5 rounded-r-md text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-95'
      onClick={() => onIncrease(index)}
    >
      <IconPlus size={16} strokeWidth={2.5} />
    </button>
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
  // Capture purchase date once when component mounts to avoid changing during edits
  const [purchaseDate] = useState(() => new Date());
  // Formatted IST string used for display & storage (authoritative value)
  const istDate = formatIST(purchaseDate);



  async function onSubmit(data) {

    const formData = {
      ...data,
      total,
      paymentMethod: payment,
      invoiceId: invoiceID,
      userId: user.id,
      selectedProducts: selectedRows,
      purchaseDate: purchaseDate.toISOString(), // optional raw ISO for querying/sorting
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
    <div className="flex flex-col lg:flex-row gap-4 p-4 md:px-4 h-full w-full">
      {/* LEFT: Billing Form */}
      <Card className="flex-1 w-full overflow-hidden border border-border/60 shadow-md backdrop-blur-sm bg-card/90">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-xl font-semibold text-foreground">Invoice Details</CardTitle>
          <CardDescription className="text-muted-foreground">
            Create, review, and manage customer invoices
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-2 space-y-6">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Customer Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Label>Customer Name</Label>
                <Input
                  {...register("customerName", { required: true })}
                  placeholder="Enter customer name"
                  className="h-10 border-input focus:ring-2 focus:ring-ring"
                />
                {errors.customerName && (
                  <p className="text-sm text-destructive">Customer name is required.</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label>Date of Purchase</Label>
                <Input
                  defaultValue={istDate}
                  {...register('purchaseDate')}
                  readOnly
                  className="h-10 border-input bg-muted/20 text-muted-foreground"
                />
              </div>
            </div>

            {/* Payment Section */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Label>Payment Method</Label>
                <Select onValueChange={setPayment}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Cash", "Google Pay UPI", "PhonePe UPI", "BharatPe UPI", "Paytm", "Net Banking"].map(
                      (item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product Selector */}
            <div className="border border-border/60 rounded-lg overflow-hidden shadow-sm">
              <div className="flex justify-between items-center px-4 py-2 bg-muted/40 border-b border-border/60">
                <div>
                  <h3 className="font-semibold text-foreground">Products</h3>
                  <p className="text-xs text-muted-foreground">Select items for this invoice</p>
                </div>
                <span className="text-sm text-muted-foreground">{selectedRows.length} selected</span>
              </div>

              <div className="max-h-52 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <Loader />
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {allProducts?.map((product, index) => (
                      <div
                        key={product.$id}
                        className="grid grid-cols-5 items-center text-center py-3 hover:bg-accent/40 transition-colors"
                      >

                        <div className='flex justify-center'>
                          <Checkbox
                            checked={selectedRows.some(item => item.$id === product.$id)}
                            onCheckedChange={(checked) => handleCheckboxChange(product, index, checked)}
                          />
                        </div>
                        <img
                          src={product.productImage}
                          alt={product.productName}
                          className="w-10 h-10 rounded-md object-cover border border-border"
                        />

                        <div className=" text-left truncate text-sm font-medium text-foreground">
                          {product.productName}
                        </div>

                        <div className="text-sm font-semibold">₹{product.price}</div>

                        <QuantityCounter
                          index={index}
                          quantity={quantities[index]}
                          onIncrease={handleIncrease}
                          onDecrease={handleDecrease}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-card/80 backdrop-blur-sm border-t border-border/60 py-4 flex flex-wrap justify-between items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="hidden peer" onClick={() => setTax(!tax)} />
                <span className="w-5 h-5 bg-background border border-input rounded flex items-center justify-center peer-checked:bg-primary peer-checked:text-primary-foreground transition">
                  <IconCheck size={14} />
                </span>
                <span className="text-sm font-medium">Add Tax (18%)</span>
              </label>

              <div className="flex gap-3">
                <div className='px-4 py-2 bg-background rounded-lg border border-border cursor-pointer hover:bg-background/60 select-none' onClick={handleReset}>
                  Cancel
                </div>
                <Button type="submit">
                  {isPending ? <Loader /> : 'Save Invoice'}
                </Button>
                <Button type="button" onClick={handlePrint} className="bg-primary hover:bg-primary/90">
                  {isPending ? <Loader /> : 'Print & Save'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* RIGHT: Invoice Preview */}
      <div className="flex-1">
        <InvoicePreview
          ref={invoiceRef}
          user={user}
          selectedRows={selectedRows}
          customerName={customerName}
          paymentMethod={payment}
          purchaseDate={istDate}
          total={total}
          subtotal={subtotal}
          tax={Tax}
          addTax={tax}
          invoiceID={invoiceID}
        />
      </div>
    </div>

  );
};


export default Billing;
