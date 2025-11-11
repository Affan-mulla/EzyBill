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
import { useSignInAccount } from '@/lib/Query/queryMutation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { mutateAsync: signInAccount, isLoading: isSigningIn } = useSignInAccount();
  const { checkAuthUser } = useUserContext();
  const { register, handleSubmit } = useForm();

  async function onSubmit(data) {
    try {
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
            Login to Your Account
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 "
          >
            <div>
              <Label>Email</Label>
              <Input
                {...register('email', { required: true })}
                className="bg-transparent border border-input"
                placeholder="Email"
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                {...register('password', { required: true })}
                className="bg-transparent border border-input"
                type="password"
              />
            </div>

            <div className="flex gap-1 text-sm">
              <p>Don't have an Account?</p>
              <Link to="/register">
                <p className="font-bold text-violet-400">Register</p>
              </Link>
            </div>

            <Button className="text-lg h-9 w-full tracking-tight">
              {isSigningIn ? <Loader /> : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;