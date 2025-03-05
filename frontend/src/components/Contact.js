import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaHome, FaAddressBook, FaSignOutAlt } from 'react-icons/fa'; 
import '../styles/Contact.css';

const Contact = () => {
    const [user, setUser] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const isAdmin = localStorage.getItem("is_admin") === "true";  

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const currentUserResponse = await axios.get('http://127.0.0.1:8000/api/user/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCurrentUser(currentUserResponse.data);

            const usersResponse = await axios.get('http://127.0.0.1:8000/api/users/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(usersResponse.data);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    const handleFollowToggle = async (targetUserId, isFollowing) => {
        try {
            const token = localStorage.getItem('token');
            const url = `http://127.0.0.1:8000/api/users/${targetUserId}/${isFollowing ? 'unfollow' : 'follow'}/`;

            await axios.post(url, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUser((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === targetUserId ? { ...user, is_following: !isFollowing } : user
                )
            );
        } catch (error) {
            console.error('Error toggling follow status', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://127.0.0.1:8000/api/admin/users/${userId}/delete/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUser(user.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Error deleting user', error);
            alert("Failed to delete user. Please try again.");
        }
    };

    return (
        <div id="Contact-page">
                <div className="header">
                    <div className="header-left">
                        {currentUser ? (  
                            <>
                                <img src={currentUser?.profile_picture || 'https://via.placeholder.com/40'} 
                                    alt="Profile" className="profile-picture" />
                                <span className="user-name">{currentUser?.first_name} {currentUser?.last_name}</span>
                                <span className="divider">|</span>

                                <Link to={`/profile/${currentUser?.id}`} className="nav-button">
                                    <FaUser className="icon" /> Profile
                                </Link>
                                
                                <Link to="/home" className="nav-button">
                                    <FaHome className="icon" /> Timeline
                                </Link>

                                <Link to="/contact" className="nav-button">
                                    <FaAddressBook className="icon" /> Contact
                                </Link>
                            </>
                        ) : (
                            <p>Loading...</p> 
                        )}
                    </div>
                    

                    <button onClick={handleLogout} className="logout-button">
                        <FaSignOutAlt className="icon" /> Logout
                    </button>
                </div>

            <div className="contact-container">
            <h2>Contact</h2>
            <div className="user-list">
            {user.map((u) => (
                <div key={u.id} className="user-card">
                    <img src={u.profile_picture || 'https://via.placeholder.com/50'} alt="Profile" className="profile-picture-small" />
                    <Link to={`/profile/${u.id}`} className="user-list-name">
                        {u.first_name} {u.last_name}
                    </Link>
                    <span>@{u.username}</span>
                    {u.id.toString() === localStorage.getItem("user_id") ? (
                        <span className="self-text">This is you</span>
                    ) : (
                        <button className="follow-button" onClick={() => handleFollowToggle(u.id, u.is_following)}>
                            {u.is_following ? 'Unfollow' : 'Follow'}
                        </button>
                    )}

                    {isAdmin && (
                        <button onClick={() => handleDeleteUser(u.id)} className="delete-button">
                            Delete User
                        </button>
                    )}
                </div>
            ))}

            </div>
        </div>
        </div>
    );
};

export default Contact;

