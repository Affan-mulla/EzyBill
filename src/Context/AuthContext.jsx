import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import authService from '@/lib/appWrite/api';

export const INITIAL_USER = {
  id: '',
  name: '',
  shopName: '',
  email: '',
  imageUrl: '',
  phone: '',
  address: '',
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false,
};

const AuthContext = createContext(INITIAL_STATE);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const checkAuthUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();

      if (currentUser) {
        setUser({
          id: currentUser.$id,
          name: currentUser.ownerName,
          shopName: currentUser.shopName,
          email: currentUser.email,
          imageUrl: currentUser.logo.replace('/preview', '/view'),
          phone: currentUser.phone,
          address: currentUser.address,
        });

        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cookieFallback = localStorage.getItem('cookieFallback');
    if (!cookieFallback || cookieFallback === '[]') {
      navigate('/register');
    }

    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        setUser,
        setIsAuthenticated,
        checkAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);

