import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';
import App from './App.tsx';
import './i18n/index.ts';
import Navbar from './components/Navbar.tsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Navbar />
            <main className="min-h-screen">
                <App />
            </main>
        </BrowserRouter>
    </StrictMode>
);
