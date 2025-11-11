import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { IconCaretDownFilled } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import FileUploader from '@/components/ui/FileUploader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUserContext } from '@/Context/AuthContext';
import { useCreateProduct, useEditProduct } from '@/lib/Query/queryMutation';

const AddProductForm = ({ action, currentData }) => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productName: currentData?.productName || '',
      stock: currentData?.Stock || 0,
      description: currentData?.description || '',
      price: currentData?.price || 0,
    },
  });

  const { mutateAsync: createProduct, isPending } = useCreateProduct();
  const { mutateAsync: editProduct, isPending: editing } = useEditProduct();

  async function onsubmit(data) {
    if (!uploadedFiles.length && action !== 'edit') {
      return;
    }

    const productData = {
      ...data,
      userId: user.id,
      images: uploadedFiles,
    };

    if (action === 'edit') {
      await editProduct({
        ...productData,
        productId: currentData.$id,
        imageId: currentData.imageId,
        imageUrl: currentData.productImage,
      });
      navigate('/products');
    } else {
      await createProduct(productData);
      navigate('/products');
    }
  }

  const handleFileChange = (files) => {
    setUploadedFiles(files);
    setValue('images', files);
  };

  const discard = () => {
    navigate('/products');
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit(onsubmit)}
    >
      <div className="flex w-full justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <IconCaretDownFilled className="text-muted-foreground" />
          <h1 className="md:text-3xl text-2xl tracking-tight font-semibold">
            {action === 'edit' ? 'Edit Product' : 'Add Product'}
          </h1>
        </div>
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={discard}
            disabled={isPending || editing}
          >
            Discard
          </Button>
          <Button type="submit" disabled={isPending || editing}>
            {isPending || editing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {action === 'edit' ? 'Updating...' : 'Creating...'}
              </>
            ) : action === 'edit' ? (
              'Update Product'
            ) : (
              'Save Product'
            )}
          </Button>
        </div>
      </div>

      <div className="md:px-5 md:py-4 md:gap-5 gap-4 w-full py-3 grid grid-cols-1 sm:grid-cols-2">
        <div className="bg-card shadow-md dark:shadow-none w-full px-4 py-5 rounded-md border flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Product Details</h2>
          <div className="space-y-2">
            <Label htmlFor="productName">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="productName"
              {...register('productName', { required: 'Product name is required' })}
              placeholder="Enter product name"
              className={errors.productName ? 'border-destructive' : ''}
            />
            {errors.productName && (
              <p className="text-sm text-destructive">{errors.productName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter product description"
              rows={4}
            />
          </div>
        </div>

        <div className="w-full rounded-md border bg-card shadow-md  px-4 py-5">
          <div className="grid gap-3">
            <Label htmlFor="category" className="text-xl font-semibold tracking-tight">
              Category
            </Label>
            <Select>
              <SelectTrigger id="category" aria-label="Select category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="juice">Juice</SelectItem>
                <SelectItem value="beverages">Beverages</SelectItem>
                <SelectItem value="food">Food</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger id="subcategory" aria-label="Select sub-category">
                <SelectValue placeholder="Select sub-category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desert">Desert</SelectItem>
                <SelectItem value="sweet">Sweet</SelectItem>
                <SelectItem value="snacks">Snacks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="py-4 bg-card shadow-md dark:shadow-none  rounded-md border flex flex-col items-center w-full h-[200px] sm:h-fit">
          <h2 className="text-xl font-semibold tracking-tight text-center mb-4">
            Upload Product Image
          </h2>
          <FileUploader
            fieldChange={handleFileChange}
            mediaUrl={currentData?.productImage}
            required={action !== 'edit'}
          />
        </div>

        <div className=" h-full w-full dark:shadow-none shadow-md px-4 py-3 flex flex-col rounded-md border bg-card gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Pricing & Stock</h2>
          <div className="space-y-2">
            <Label htmlFor="stock">
              Stock <span className="text-destructive">*</span>
            </Label>
            <Input
              id="stock"
              type="number"
              {...register('stock', {
                required: 'Stock is required',
                min: { value: 0, message: 'Stock cannot be negative' },
              })}
              placeholder="Enter stock quantity"
              className={errors.stock ? 'border-destructive' : ''}
            />
            {errors.stock && (
              <p className="text-sm text-destructive">{errors.stock.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">
              Price <span className="text-destructive">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register('price', {
                required: 'Price is required',
                min: { value: 0.01, message: 'Price must be greater than 0' },
              })}
              placeholder="Enter price"
              className={errors.price ? 'border-destructive' : ''}
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            )}
          </div>
        </div>
      </div>
    </motion.form>
  );
};

export default AddProductForm;
