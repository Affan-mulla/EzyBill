import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryProvider } from './lib/Query/QueryProvider.jsx'
import AuthProvider from './Context/AuthContext.jsx'
import { ThemeProvider } from './Context/ThemeProvider.jsx'

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
)
