import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';
import App from './App.tsx';
import './i18n/index.ts';
import Navbar from './pages/Layout/Navbar.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <main className="min-h-screen">
                    <App />
                </main>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
);
