import { Route, Routes } from 'react-router-dom';
import JournalPage from './pages/JournalPage';
import LandingPage from './pages/LandingPage';
import RoutePage from './pages/RoutesPage';
import SocialPage from './pages/SocialPage';
import Weather from './pages/WeatherPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/routes" element={<RoutePage />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/social" element={<SocialPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
