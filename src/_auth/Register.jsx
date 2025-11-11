import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { GridBackgroundDemo } from '@/components/ui/Background';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loader from '@/components/ui/Loader';
import { Spotlight } from '@/components/ui/spotlight';
import { useUserContext } from '@/Context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCreateUserAccount, useSignInAccount } from '@/lib/Query/queryMutation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Register = () => {
    const { toast } = useToast();
    const { checkAuthUser } = useUserContext();
    const navigate = useNavigate();
    const { mutateAsync, isPending } = useCreateUserAccount();
    const { mutateAsync: signInAccount } = useSignInAccount();
    const { register, handleSubmit } = useForm();

    async function onSubmit(data) {
        try {
            const newUser = await mutateAsync(data);

            if (!newUser) {
                return toast({
                    title: 'Uh oh! Something went wrong. Sign Up Failed.',
                });
            }

            const session = await signInAccount({
                email: data.email,
                password: data.password,
            });

            if (!session) {
                return toast({ title: 'Sign in failed. Please try again.' });
            }

            const isLoggedIn = await checkAuthUser();

            if (isLoggedIn) {
                navigate('/');
            } else {
                toast({ title: 'Sign in failed. Please try again.' });
            }
        } catch (error) {
            console.error(error);
            toast({ title: 'An error occurred. Please try again.' });
        }
    }

    return (
        <div className="h-screen flex justify-center items-center">
            <Card>
                <CardHeader>
                    <CardTitle>
                        Create a New Account
                    </CardTitle>
                    <CardDescription>
                        Fill in the details to register.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 "
                    >

                        <div className="flex gap-2">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    {...register('name', { required: true })}
                                    className="bg-transparent border"
                                    placeholder="Name"
                                />
                            </div>
                            <div>
                                <Label>Shop Name</Label>
                                <Input
                                    {...register('shopName', { required: true })}
                                    className="bg-transparent border"
                                    placeholder="Shop Name"
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Phone</Label>
                            <Input
                                {...register('phone', { required: true })}
                                className="bg-transparent border"
                                placeholder="Phone"
                            />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input
                                {...register('email', { required: true })}
                                className="bg-transparent border"
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <Label>Password</Label>
                            <Input
                                {...register('password', { required: true })}
                                className="bg-transparent border"
                                type="password"
                            />
                        </div>
                        <div className="flex gap-1">
                            <p>Already have an account?</p>
                            <Link to="/login">
                                <p className="font-bold text-violet-400">Login</p>
                            </Link>
                        </div>

                        <Button className="mt-2 text-lg h-9 w-full tracking-tight">
                            {isPending ? <Loader /> : 'Submit'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Register;