import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loader from '@/components/ui/Loader';
import { useUserContext } from '@/Context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useUpdateProfile } from '@/lib/Query/queryMutation';
import React, { useCallback, useState } from 'react';

import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
const Setting = () => {

  const { user } = useUserContext();
  const [fileUrl, setFileUrl] = useState(user.imageUrl || ''); // Initial fileUrl state
  const { mutateAsync, isPending } = useUpdateProfile()
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      ownerName: user.name,
      shopName: user.shopName,
      email: user.email,
      phone: user.phone, // default phone as empty string
    },
  });

  const onsubmit = async (data) => {
    const formData = {
      ...data,
      ownerId: user.id,
      imageUrl: user.imageUrl,
    }
    const updateProfile = await mutateAsync(formData)

    if (!updateProfile) {
      return toast({
        variant: 'destructive',
        title: 'something went wrong please try again later.'
      })
    }

    return toast({
      title: 'Profile updated successfully.'
    })

  };

  const onDrop = useCallback((acceptedFiles) => {
    setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    setValue('file', acceptedFiles); // Setting file in form state
  }, [setValue]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
  });



  return (
    <div className=' flex px-4 md:px-10 md:py-2 py-3 w-full dark:bg-neutral-950'>
      {user.id !== '' ? (
        <Card className='w-full h-full'>
          <div className='h-full w-full flex px-6 py-4  border rounded-md  flex-col gap-4'>
          <div>
            <h1 className='md:text-3xl text-2xl tracking-tight'>Settings</h1>
          </div>
          <form onSubmit={handleSubmit(onsubmit)} className='flex-1 flex flex-col gap-3'>
            <div className='w-fit'>
              <img
                src={fileUrl || user.imageUrl}
                alt='profile-img'
                className='object-cover w-14 h-14 rounded-full'
              />
              <div {...getRootProps()}>
                <label className='cursor-pointer text-violet-500 hover:text-violet-600 transition duration-200'>
                  Choose Logo
                </label>
                <input
                  id='profile-upload'
                  type='file'
                  accept='image/*'
                  className='hidden'
                  {...getInputProps()}
                />
              </div>
            </div>

            <div>
              <Label>Owner Name</Label>
              <Input {...register('ownerName')} placeholder='Owner Name' />
            </div>
            <div>
              <Label>
                Shop Name{' '}
                <span className='text-zinc-400'>
                  (Please Enter Full Name, this will Show on your bill.)
                </span>
              </Label>
              <Input {...register('shopName')} placeholder='Shop Name' />
            </div>
            <div>
              <Label>Email</Label>
              <Input {...register('email')} placeholder='abc@example.com' />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input
                {...register('phone', { pattern: /^[0-9]{10}$/ })}
                placeholder='1234567890'
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input {...register('password', {required: true})} />
            </div>

          <div>
              <Button>
                Save  
              </Button>            
          </div>
          

          </form>
        </div>

    
        </Card>


      ) : (
        <Loader />
      )}

    
    </div>
  );
};

export default Setting;
