import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Services from './components/Services';
import Orders from './components/Orders';
import Users from './components/Users';
import Payments from './components/Payments';
import AdminLogin from './components/AdminLogin';
import Profile from './components/Profile';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <Router>
            {!isAuthenticated ? (
                <AdminLogin setIsAuthenticated={setIsAuthenticated} />
            ) : (
                <Box sx={{ display: 'flex' }}>
                    <Header setIsAuthenticated={setIsAuthenticated} />
                    <Sidebar />
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                        <Toolbar />
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/services" element={<Services />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/payments" element={<Payments />} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </Box>
                </Box>
            )}
        </Router>
    );
}

export default App;