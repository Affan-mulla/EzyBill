import { Button } from '@/components/ui/button';
import FileUploader from '@/components/ui/FileUploader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loader from '@/components/ui/Loader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUserContext } from '@/Context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useCreateProduct, useEditProduct } from '@/lib/Query/queryMutation';
import { IconCaretDownFilled } from '@tabler/icons-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const AddProductForm = ({action, currentData}) => {
  
    const {user} = useUserContext()
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            productName: currentData?.productName,
            stock: currentData?.Stock,
            description: currentData?.description,
            price: currentData?.price,
        }
    });
    const [uploadedFiles, setUploadedFiles] = useState([]);  // Store uploaded images
  
    const navigate = useNavigate()
    const {mutateAsync, isPending} = useCreateProduct();
    const {mutateAsync: editProduct, isPending: editing} = useEditProduct();
  
    // Form submit handler
    async function onsubmit(data) {

        
      const productData = {
        ...data,
        userId : user.id,
        images: uploadedFiles,  // Include uploaded images in the form data
      };
      
      if(action=="edit") {
        const updateProduct = await editProduct({
            ...productData,
            productId : currentData.$id,
            imageId : currentData.imageId,
            imageUrl : currentData.productImage,
        });

        if(!updateProduct) {
            return toast({
                variant: 'destructive',
                title : "OOPS! Something went Wrong."
            })
        }

        return navigate('/products');
      }
  
      const newProduct = await mutateAsync(productData);
  

  
      if(!newProduct) {
        return toast({
          title : "OOPS! Something went Wrong."
        })
      }
  
      navigate("/products")
  
      
    }
  
    // File handler to update uploaded files
    const handleFileChange = (files) => {
      setUploadedFiles(files);
      setValue('images', files);  // Set value for react-hook-form
    };
  
    const discard = () => {
      navigate('/products');
  
  
    }
  return (
    <form onSubmit={handleSubmit(onsubmit)}>
    <div className='flex w-full justify-between'>
      <div className='flex justify-center items-center'>
        <IconCaretDownFilled />
        <h1 className='md:text-3xl text-2xl tracking-tight font-medium'>{action=='edit' ? "Edit Product" : "Add Product"}</h1>
      </div>
      <div className='flex gap-4 justify-center items-center'>
        <div className='dark:bg-neutral-950  cursor-pointer hover:bg-zinc-200 dark:hover:bg-neutral-950/50 transition-all duration-100 py-2 border-[1px] tracking-tight px-4 text-md rounded-md' onClick={discard}>Discard</div>
        <Button size='default' type='submit'>{isPending || editing ? (
          <Loader />
        ) : (
            action=='edit' ? "Edit Product" : "Save Product"
        )}</Button>
      </div>
    </div>

    <div className='md:px-5 md:py-4  md:gap-5 gap-4 w-full py-3 grid grid-cols-1  sm:grid-cols-2'>
      <div className='dark:bg-neutral-950 shadow-md dark:shadow-none w-full  px-4 py-5 rounded-md border-[1px] flex flex-col gap-4'>
        <h1 className='text-2xl tracking-tight'>Product Details</h1>
        <div>
          <Label>Name</Label>
          <Input {...register("productName", { required: true })} placeholder='Enter Product Name' />
          {errors.productName && <p className='text-red-500'>Product Name is required</p>}
        </div>
        <div>
          <Label>Description</Label>
          <Textarea {...register("description")} placeholder='Enter Something about Product'  />
        </div>
      </div>
      
      <div className='w-full rounded-md border-[1px] bg-zinc-50 shadow-md dark:bg-neutral-950 px-4 py-5'>
      <div className="grid gap-3">
        <Label htmlFor="category" className='text-2xl tracking-tight'>Category</Label>
        <Select>
          <SelectTrigger id="category" aria-label="Select category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clothing">Juice</SelectItem>
            <SelectItem value="electronics">Beverages</SelectItem>
            <SelectItem value="accessories">Food</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger id="category" aria-label="Select category">
            <SelectValue placeholder="Select sub-category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Desert">Desert</SelectItem>
            <SelectItem value="Sweet">Sweet</SelectItem>
            <SelectItem value="Snacks">Snacks</SelectItem>
          </SelectContent>
        </Select>
      </div>
      </div>

      <div className='py-4 dark:bg-neutral-950 shadow-md dark:shadow-none bg-zinc-50 rounded-md border-[1px] flex sm:gap-5  flex-col items-center w-full  h-[200px] sm:h-fit '>
        <h2 className='text-2xl tracking-tight text-center'>Upload Product Image</h2>
        {/* Pass file handler to FileUploader */}
        <FileUploader fieldChange={handleFileChange} mediaUrl={currentData?.productImage} required/>
      </div>

      <div className='sm:w-fit h-full w-full dark:shadow-none shadow-md px-4 py-3 flex flex-col rounded-md border-[1px] dark:bg-neutral-950 bg-zinc-50'>
        <h1 className='text-2xl tracking-tight '>Stock and Pricing</h1>
        <div className=' flex gap-4 flex-wrap '>
          <div >
            <Label>Stock</Label>
            <Input  {...register("stock", { required: true })} type='number' placeholder="stock" />
          </div>
          <div>
            <Label>Price</Label>
            <Input {...register("price", { required: true })} type='number' placeholder="price" />
          </div>
          <div>
            <Label>Date and time</Label>
            <Input value={new Date().toLocaleString()} type='text' disabled placeholder="price" />
          </div>
        </div>
      </div>

     
    </div>
  </form>
  )
}

export default AddProductForm