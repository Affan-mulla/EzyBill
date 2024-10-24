import React from 'react'
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, useNavigate } from 'react-router-dom'
import { Spotlight } from '@/components/ui/spotlight'
import { GridBackgroundDemo } from '@/components/ui/Background'
import { useCreateUserAccount, useSignInAccount } from '@/lib/Query/queryMutation'
import { useToast } from '@/hooks/use-toast'
import { useUserContext } from '@/Context/AuthContext'
import Loader from '@/components/ui/Loader'



const Register = () => {

    const { toast } = useToast();
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
    const navigate = useNavigate();

    const { mutateAsync, isPending } = useCreateUserAccount();
    const { mutateAsync: signInAccount, isLoading: isSigningIn } = useSignInAccount();




    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    async function onSubmit(data) {
        try {
            const newUser = await mutateAsync(data);

            if (!newUser) {
                return toast({
                    title: "Uh oh! Something went wrong. Sign Up Failed.",
                })
            }

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
                return toast({ title: 'sign in failed. please try again.'})
            }

        } catch (error) {
            console.log(error);

        }
    }


    return (

        <div className='h-screen flex justify-center items-center'>
            <GridBackgroundDemo />
            <Spotlight />
            <form onSubmit={handleSubmit(onSubmit)} className=' absolute md:max-w-[25rem] max-w-[20rem] w-full bg-neutral-950 border text-white p-5 rounded-md flex flex-col gap-2'>

                <div>
                    <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                        Create Your Account
                    </h2>
                    <p>Enter your details to create an account.</p>
                </div>

                <div className='flex gap-2'>
                    <div>
                        <Label>Name</Label>
                        <Input {...register("name", { required: true })} className='bg-transparent border' placeholder='Name' />
                    </div>
                    <div>
                        <Label>Shop Name</Label>
                        <Input {...register("shopName", { required: true })} className='bg-transparent border' placeholder='Shop Name' />
                    </div>
                </div>
                <div>
                    <Label>Phone</Label>
                    <Input {...register("phone", { required: true })} className='bg-transparent border' placeholder='Phone' />
                </div>
                <div>
                    <Label>Email</Label>
                    <Input {...register("email", { required: true })} className='bg-transparent border' placeholder='Email' />
                </div>
                <div>
                    <Label>Password</Label>
                    <Input {...register("password", { required: true })} className='bg-transparent  border' type='password' />
                </div>
                <div className='flex gap-1'>
                    <p>Already have an account ? </p>
                    <Link to={`/login`}>
                        <p className='font-bold text-violet-400'>Login</p>
                    </Link>
                </div>

                <Button className=' mt-2  text-lg h-9 w-full tracking-tight'>{isPending ? (
                    <Loader/>
                ) :
                "Submit"}</Button>
            </form>
        </div>
    )
}

export default Register