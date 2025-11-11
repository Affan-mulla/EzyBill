import { SettingsSkeleton } from '@/components/Shared/Setting/SettingSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loader from '@/components/ui/Loader';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useUserContext } from '@/Context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useUpdateProfile } from '@/lib/Query/queryMutation';
import React, { useCallback, useState, useMemo } from 'react';
import { useEffect } from 'react';

import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
const MAX_FILE_SIZE_MB = 2;
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

const Setting = () => {
  const { user, setUser } = useUserContext();
  const [fileUrl, setFileUrl] = useState(user.imageUrl || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const { mutateAsync, isPending } = useUpdateProfile();
  const { register, handleSubmit, setValue, formState: { errors }, watch, reset } = useForm({
    mode: 'onChange',
    defaultValues: {
      ownerName: user.name || '',
      shopName: user.shopName || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '',
      ownerId: user.id || '',
      address: user.address || ''
    }
  });

  useEffect(() => {
    if (user?.id) {
      reset({
        ownerName: user.name || '',
        shopName: user.shopName || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        ownerId: user.id,
        address: user.address || ''
      });
      setFileUrl(user.imageUrl || '');
    }
  }, [user, reset]);


  const watched = watch();
  const hasChanges = useMemo(() => {
    return (
      watched.ownerName !== (user.name || '') ||
      watched.shopName !== (user.shopName || '') ||
      watched.email !== (user.email || '') ||
      watched.phone !== (user.phone || '') ||
      (watched.password && watched.password.length > 0) ||
      selectedFile !== null
    );
  }, [watched, user, selectedFile]);

  const validateFile = (file) => {
    if (!file) return true;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({ variant: 'destructive', title: 'Invalid file type. Use PNG/JPEG' });
      return false;
    }
    if (file.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
      toast({ variant: 'destructive', title: `File too large. Max ${MAX_FILE_SIZE_MB}MB` });
      return false;
    }
    return true;
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!validateFile(file)) return;
    setSelectedFile(file);
    setFileUrl(URL.createObjectURL(file));
    setValue('file', file, { shouldDirty: true });
  }, [setValue]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 1
  });

  const onsubmit = async (data) => {
    if (!hasChanges) {
      return toast({ title: 'No changes to save', description: 'Modify a field or choose a new logo.' });
    }

    const formData = new FormData();
    formData.append('ownerId', data.ownerId);
    formData.append('ownerName', data.ownerName);
    formData.append('shopName', data.shopName);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('address', data.address);
    if (data.password) formData.append('password', data.password);
    if (selectedFile) formData.append('file', selectedFile);


    try {
      const updated = await mutateAsync(formData);
      if (!updated) throw new Error('Update failed');
      toast({ title: 'Profile updated successfully.' });
      reset({ ...data, password: '' });
      setSelectedFile(null);

      setUser((prev) => ({
        ...prev,
        name: updated.ownerName,
        shopName: updated.shopName,
        email: updated.email,
        phone: updated.phone,
        imageUrl: updated.logo?.replace("/preview", "/view"),
        address: updated.address
      }));

    } catch (e) {
      toast({ variant: 'destructive', title: 'Update failed', description: e.message });
    }
  };

  if (!user.id) return (
    <SettingsSkeleton />
  )


  return (
    <div className='px-4 md:px-10 py-4 w-full'>
      <Card className='w-full border border-border/60 shadow-sm bg-card/90 backdrop-blur'>
        <CardHeader className='pb-4 border-b border-border/50'>
          <CardTitle className='text-2xl font-semibold tracking-tight'>Settings</CardTitle>
          <CardDescription>Update your profile, shop identity and billing details.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onsubmit)}>
          <CardContent className='space-y-6 pt-6'>
            <div className='flex items-start gap-6'>
              <div className='flex flex-col items-center gap-2'>
                <img
                  src={fileUrl || user.imageUrl}
                  alt='profile-img'
                  className='object-cover w-16 h-16 rounded-full border border-border shadow-sm'
                />
                <div
                  {...getRootProps()}
                  className={`text-xs px-3 py-1.5 rounded-md border border-border cursor-pointer transition-colors ${isDragActive ? 'bg-accent/30' : 'hover:bg-accent/20'} select-none`}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? 'Drop image…' : 'Change Logo'}
                </div>
                {selectedFile && (
                  <span className='text-xs text-muted-foreground max-w-[120px] truncate'>{selectedFile.name}</span>
                )}
              </div>
              <p className='text-xs text-muted-foreground leading-relaxed max-w-sm'>This logo appears on invoices. Recommended square PNG/JPG under {MAX_FILE_SIZE_MB}MB.</p>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-1.5'>
                <Label htmlFor='ownerName'>Owner Name</Label>
                <Input id='ownerName' {...register('ownerName', { required: 'Owner name is required.' })} placeholder='Owner Name' />
                {errors.ownerName && <p className='text-xs text-destructive'>{errors.ownerName.message}</p>}
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='shopName'>Shop Name <span className='text-muted-foreground'>(Shown on bills)</span></Label>
                <Input id='shopName' {...register('shopName', { required: 'Shop name is required.' })} placeholder='Full Shop Name' />
                {errors.shopName && <p className='text-xs text-destructive'>{errors.shopName.message}</p>}
              </div>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-1.5'>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' type='email' {...register('email', { required: 'Email is required.', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email.' } })} placeholder='owner@example.com' />
                {errors.email && <p className='text-xs text-destructive'>{errors.email.message}</p>}
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='phone'>Phone Number</Label>
                <Input id='phone' {...register('phone', { required: 'Phone number is required.', pattern: { value: /^[0-9]{10}$/, message: 'Enter 10 digits.' } })} placeholder='9876543210' />
                {errors.phone && <p className='text-xs text-destructive'>{errors.phone.message}</p>}
              </div>
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='shopName'>Shop Address <span className='text-muted-foreground'>(Shown on bills)</span></Label>
              <Textarea id='address' {...register('address')} placeholder='Full Shop Address' rows={3} maxLength={100} />
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='password'>Password <span className='text-muted-foreground'>(Leave blank to keep unchanged)</span></Label>
              <Input id='password' type='password' {...register('password', { minLength: { value: 6, message: 'Minimum 6 characters.' } })} placeholder='••••••••' />
              {errors.password && <p className='text-xs text-destructive'>{errors.password.message}</p>}
            </div>
          </CardContent>
          <CardFooter className='flex justify-between items-center gap-4 pt-4 border-t border-border/50'>
            <p className='text-xs text-muted-foreground'>Make sure details match what appears on invoices.</p>
            <Button type='submit' disabled={!hasChanges || isPending} className='min-w-[140px]'>
              {isPending ? <Loader /> : hasChanges ? 'Save Changes' : 'No Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Setting;
