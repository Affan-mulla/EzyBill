import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { QueryProvider } from './lib/Query/QueryProvider';
import AuthProvider from './Context/AuthContext';
import { ThemeProvider } from './Context/ThemeProvider';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  </BrowserRouter>
);
