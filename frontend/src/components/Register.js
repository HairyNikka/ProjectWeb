import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // นำเข้า useNavigate

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');  // เพิ่ม state สำหรับเก็บข้อความผิดพลาด
    const [successMessage, setSuccessMessage] = useState('');  // เพิ่ม state สำหรับเก็บข้อความสำเร็จ
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password || !password2 || !firstName || !lastName) {
            setErrorMessage('Please fill in all fields');  // แจ้งเตือนเมื่อข้อมูลไม่ครบ
            return;
        }
        if (password !== password2) {
            setErrorMessage('Passwords do not match');  // แจ้งเตือนเมื่อรหัสผ่านไม่ตรงกัน
            return;
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('password2', password2);
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        if (profilePicture) {
            formData.append('profile_picture', profilePicture);
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Registration successful', response.data);
            setSuccessMessage('Registration successful! Redirecting to login...');  // แสดงข้อความสำเร็จ
            setTimeout(() => {
                navigate('/login');  // เปลี่ยนเส้นทางไปที่หน้า Login หลังจากแสดงข้อความสำเร็จ
            }, 2000);  // หน่วงเวลา 2 วินาที
        } catch (error) {
            if (error.response) {
                setErrorMessage('Registration failed: ' + JSON.stringify(error.response.data));
            } else if (error.request) {
                setErrorMessage('No response received from the server');
            } else {
                setErrorMessage('Error: ' + error.message);
            }
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}  {/* แสดงข้อความผิดพลาด */}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}  {/* แสดงข้อความสำเร็จ */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                </div>
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Profile Picture:</label>
                    <input
                        type="file"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;