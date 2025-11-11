import { Route, Routes } from 'react-router';
import AuthLayout from './_auth/AuthLayout';
import Login from './_auth/Login';
import Register from './_auth/Register';
import RootLayout from './_root/RootLayout';
import Billing from './_root/Pages/Billing';
import Customer from './_root/Pages/Customer';
import Dashboard from './_root/Pages/Dashboard';
import Products from './_root/Pages/Products';
import Setting from './_root/Pages/Setting';
import AddProduct from './components/Shared/AddProduct';
import EditProduct from './components/Shared/Product/EditProduct';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <main>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
}

export default App;
