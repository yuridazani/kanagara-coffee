// frontend/src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'; // <-- Import AuthProvider
import { WebsiteProvider } from './context/WebsiteContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>  {/* <-- Bungkus di sini */}
      <WebsiteProvider>
      <App />
      </WebsiteProvider>
    </AuthProvider> {/* <-- Jangan lupa tutup */}
  </React.StrictMode>,
)