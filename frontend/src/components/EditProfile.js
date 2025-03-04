import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/EditProfile.css'; 

const EditProfile = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const navigate = useNavigate();

    const fetchUserData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://127.0.0.1:8000/api/user/', {
                headers: { Authorization: `Bearer ${token}` },
            });

            setFirstName(response.data.first_name);
            setLastName(response.data.last_name);
            setProfilePicture(response.data.profile_picture);
        } catch (error) {
            console.error('Error fetching user data', error);
        }
    }, [navigate]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('first_name', firstName || '');
        formData.append('last_name', lastName || '');
        if (profilePicture instanceof File) {
            formData.append('profile_picture', profilePicture);
        }
    
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
    
        try {
            const response = await axios.put('http://127.0.0.1:8000/api/user/', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
            });

            setProfilePicture(response.data.profile_picture + `?timestamp=${Date.now()}`);
            fetchUserData();
            navigate(`/profile/${localStorage.getItem("user_id")}`);
        } catch (error) {
            console.error('Error updating profile', error);
        }
    };

    return (
        <div className="edit-profile-container">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>First Name:</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Last Name:</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Profile Picture:</label>
                    <input type="file" onChange={handleProfilePictureChange} />
                </div>
                <button type="submit" className="save-button">Save Changes</button>
                <button type="button" className="back-button" onClick={() => navigate(`/profile/${localStorage.getItem("user_id")}`)}>
                    Back to Profile
                </button>
            </form>
            {profilePicture && (
                <img 
                    src={profilePicture instanceof File ? URL.createObjectURL(profilePicture) : `${profilePicture}?timestamp=${Date.now()}`} 
                    alt="Profile" 
                    className="profile-picture-preview" 
                />
            )}
        </div>
    );
};

export default EditProfile;


// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const EditProfile = () => {
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [profilePicture, setProfilePicture] = useState(null);
//     const navigate = useNavigate();

//     const fetchUserData = useCallback(async () => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 navigate('/login');
//                 return;
//             }

//             const response = await axios.get('http://127.0.0.1:8000/api/user/', {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             setFirstName(response.data.first_name);
//             setLastName(response.data.last_name);
//             setProfilePicture(response.data.profile_picture); // ✅ โหลดรูปจาก API
//         } catch (error) {
//             console.error('Error fetching user data', error);
//         }
//     }, [navigate]);

//     useEffect(() => {
//         fetchUserData();
//     }, [fetchUserData]);

//     const handleProfilePictureChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setProfilePicture(file);
//         }
//         console.log("Selected File:", file); // ✅ Debug ไฟล์ที่เลือก
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
    
//         const formData = new FormData();
//         formData.append('first_name', firstName || '');
//         formData.append('last_name', lastName || '');
//         if (profilePicture instanceof File) {
//             formData.append('profile_picture', profilePicture);
//         }
    
//         console.log("FormData Sent:", [...formData]); // ✅ Debug ข้อมูลที่ส่งไปยัง API
    
//         const token = localStorage.getItem('token');
//         if (!token) {
//             navigate('/login');
//             return;
//         }
    
//         try {
//             const response = await axios.put('http://127.0.0.1:8000/api/user/', formData, {
//                 headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
//             });
    
//             console.log("API Response:", response.data); // ✅ ตรวจสอบ API Response
    
//             // ✅ บังคับให้โหลดรูปใหม่ทันที
//             setProfilePicture(response.data.profile_picture + `?timestamp=${Date.now()}`);
    
//             fetchUserData(); // ✅ โหลดข้อมูลใหม่หลังจากอัปโหลดเสร็จ
//             navigate(`/profile/${localStorage.getItem("user_id")}`); // ✅ Redirect ไปหน้า Profile
//         } catch (error) {
//             console.error('Error updating profile', error);
//             if (error.response) {
//                 console.log("API Error:", error.response.data);
//             }
//         }
//     };
    

//     return (
//         <div style={styles.container}>
//             <h2>Edit Profile</h2>
//             <form onSubmit={handleSubmit}>
//                 <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
//                 <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
//                 <input type="file" onChange={handleProfilePictureChange} />
//                 <button type="submit">Save Changes</button>
//             </form>
//             {profilePicture instanceof File ? (
//                 <img src={URL.createObjectURL(profilePicture)} alt="Profile" style={styles.profilePicture} />
//             ) : (
//                 profilePicture && <img src={`${profilePicture}?timestamp=${Date.now()}`} alt="Profile" style={styles.profilePicture} />
//             )}
//         </div>
//     );
// };

// const styles = {
//     container: {
//         maxWidth: '800px',
//         margin: '0 auto',
//         padding: '20px',
//         fontFamily: 'Arial, sans-serif',
//     },
//     profilePicture: {
//         width: '100px',
//         borderRadius: '50%',
//         marginTop: '10px',
//     },
// };

// export default EditProfile;
