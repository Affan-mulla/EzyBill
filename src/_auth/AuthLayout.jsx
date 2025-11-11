import { Navigate, Outlet } from 'react-router';

const AuthLayout = () => {
  const isAuthenticated = false;
  
  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export default AuthLayout;