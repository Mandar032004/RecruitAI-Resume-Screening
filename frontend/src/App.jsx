import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/upload" element={<UploadPage />} />
                        <Route path="/results" element={<ResultsPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </ThemeProvider>
    );
}
