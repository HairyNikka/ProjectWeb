import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  // นำเข้า Navigate
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';  // สมมติว่าคุณมีหน้า Home

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<Navigate to="/login" />} />  {/* ใช้ Navigate เพื่อเปลี่ยนเส้นทาง */}
            </Routes>
        </Router>
    );
};

export default App;