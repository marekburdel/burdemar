import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/login/RegisterPage';
import PersonsPage from './pages/person/PersonsPage';
import PersonPageForm from './pages/person/form/PersonPageForm';
import { Container } from '@mui/material';

const App: React.FC = () => {
    return (
        <Router>
            <Container maxWidth="md" sx={{ marginTop: 4 }}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/persons" element={<PersonsPage />} />
                    <Route path="/persons/:id" element={<PersonPageForm />} />
                    <Route path="/persons/create" element={<PersonPageForm />} />
                    <Route path="/" element={<LoginPage />} />
                </Routes>
            </Container>
        </Router>
    );
};

export default App;