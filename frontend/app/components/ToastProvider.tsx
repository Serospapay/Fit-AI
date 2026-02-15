'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1a1a1a',
          color: '#f5f5f5',
          border: '1px solid rgba(212, 175, 55, 0.3)',
        },
        success: {
          iconTheme: { primary: '#28a745', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: '#dc3545', secondary: '#fff' },
        },
      }}
    />
  );
}
