import { GridBackgroundDemo } from '@/components/ui/Background'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loader from '@/components/ui/Loader'
import { Spotlight } from '@/components/ui/spotlight'
import { useUserContext } from '@/Context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSignInAccount } from '@/lib/Query/queryMutation';
import React from 'react'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { mutateAsync: signInAccount, isLoading: isSigningIn } = useSignInAccount();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  async function onSubmit(data) {
    try {

      const session = await signInAccount({
        email: data.email,
        password: data.password
      });

      if (!session) {
        return toast({ title: 'sign in failed. please try again.' })
      }

      const isLoggedIn = await checkAuthUser();
      

      if (isLoggedIn) {
        navigate('/')
      } else {
        return toast({ title: 'sign in failed. please try again.' })
      }

    } catch (error) {
      console.log(error);

    }


  }

  return (
    <div className='h-screen flex justify-center items-center'>
      <GridBackgroundDemo />
      <Spotlight />
      <form onSubmit={handleSubmit(onSubmit)} className=' absolute md:max-w-[25rem] max-w-[20rem] w-full bg-neutral-950 border-[1px] border-neutral-500 text-white p-5 rounded-md flex flex-col gap-2'>

        <div>
          <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0">
            Login Into Your Account
          </h2>
          <p>Welcome Back</p>
        </div>
        <div>
          <Label>Email</Label>
          <Input {...register("email", { required: true })} className='bg-transparent border-neutral-500' placeholder='Email' />
        </div>
        <div>
          <Label>Password</Label>
          <Input {...register("password", { required: true })} className='bg-transparent  border-neutral-500' type='password' />
        </div>
        <div className='flex gap-1'>
          <p>Don't have an Account ? </p>
          <Link to={`/register`}>
            <p className='font-bold  text-violet-400'>Register</p>
          </Link>
        </div>

        <Button className=' text-lg h-9 w-full tracking-tight'>{isSigningIn ? (
          <Loader />
        ) :
          "Login"}</Button>
      </form>
    </div>
  )
}

export default Login