import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: '#1f2937',
          color: '#f9fafb',
          fontSize: '14px',
          borderRadius: '12px',
          padding: '12px 16px',
        },
        success: {
          iconTheme: { primary: '#4ade80', secondary: '#1f2937' },
        },
        error: {
          iconTheme: { primary: '#f87171', secondary: '#1f2937' },
        },
      }}
    />
  </StrictMode>,
);
