import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import RoutePage from './pages/RoutePage';
import Weather from './pages/Weather';
import SocialPage from './pages/SocialPage';
import JournalPage from './pages/JournalPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/test-home" element={<HomePage />} />
            <Route path="/routeplan" element={<RoutePage />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/social" element={<SocialPage />} />
            <Route path="/contact" element={<div>Kapcsolat oldal</div>} />
        </Routes>
    );
}

export default App;
