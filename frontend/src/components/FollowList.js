import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../styles/FollowList.css';  // ✅ Import CSS

const FollowList = () => {
    const { user_id } = useParams();
    const navigate = useNavigate();
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    const currentUserId = localStorage.getItem("user_id");

    useEffect(() => {
        fetchCurrentUser();
        fetchFollowData();
    }, [user_id]);

    const fetchCurrentUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await axios.get('http://127.0.0.1:8000/api/user/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCurrentUser(response.data);
        } catch (error) {
            console.error('Error fetching current user', error);
        }
    };

    const fetchFollowData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const [followersResponse, followingResponse] = await Promise.all([
                axios.get(`http://127.0.0.1:8000/api/users/${user_id}/followers/`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`http://127.0.0.1:8000/api/users/${user_id}/following/`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            setFollowers(followersResponse.data);
            setFollowing(followingResponse.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching follow data', error);
            setLoading(false);
        }
    };

    const handleFollowToggle = async (targetUserId, isFollowing) => {
        try {
            const token = localStorage.getItem('token');
            const url = `http://127.0.0.1:8000/api/users/${targetUserId}/${isFollowing ? 'unfollow' : 'follow'}/`;

            await axios.post(url, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // ✅ อัปเดตสถานะ follow/unfollow โดยไม่ต้องรีเฟรชหน้า
            setFollowers((prev) =>
                prev.map((f) => (f.id === targetUserId ? { ...f, is_following: !isFollowing } : f))
            );
            setFollowing((prev) =>
                prev.map((f) => (f.id === targetUserId ? { ...f, is_following: !isFollowing } : f))
            );
        } catch (error) {
            console.error('Error toggling follow status', error);
        }
    };

    if (loading || !currentUser) {
        return <div>Loading...</div>;
    }

    return (
        <div className="followlist-container">
            {/* ✅ Header ที่แสดงข้อมูลของผู้ที่ล็อกอิน */}
            <div className="header">
                <div className="header-left">
                    <img src={currentUser.profile_picture || 'https://via.placeholder.com/40'} alt="Profile" className="profile-picture" />
                    <span className="user-name">{currentUser.first_name} {currentUser.last_name}</span>
                    <Link to={`/profile/${currentUser.id}`} className="nav-button">Profile</Link>
                    <Link to="/home" className="nav-button">Timeline</Link>
                    <Link to="/contact" className="nav-button">Contact</Link>
                </div>
                <button onClick={() => navigate('/login')} className="logout-button">Logout</button>
            </div>

            {/* ✅ รายชื่อ Followers */}
            <h2>Followers</h2>
            <div className="follow-list">
                {followers.length === 0 ? <p>No followers yet.</p> : followers.map((follower) => (
                    <div key={follower.id} className="user-card">
                        <img src={follower.profile_picture || 'https://via.placeholder.com/50'} alt="Profile" className="profile-picture-small" />
                        <Link to={`/profile/${follower.id}`} className="user-name-card">
                            {follower.first_name} {follower.last_name}
                        </Link>
                        <span >@{follower.username}</span>
                        {follower.id.toString() === currentUserId ? (
                            <span className="self-text">This is you</span>
                        ) : (
                            <button className="follow-button" onClick={() => handleFollowToggle(follower.id, follower.is_following)}>
                                {follower.is_following ? 'Unfollow' : 'Follow'}
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* ✅ รายชื่อ Following */}
            <h2>Following</h2>
            <div className="follow-list">
                {following.length === 0 ? <p>Not following anyone yet.</p> : following.map((followed) => (
                    <div key={followed.id} className="user-card">
                        <img src={followed.profile_picture || 'https://via.placeholder.com/50'} alt="Profile" className="profile-picture-small" />
                        <Link to={`/profile/${followed.id}`} className="user-name-card">
                            {followed.first_name} {followed.last_name}
                        </Link>
                            <span >@{followed.username}</span>
                        {followed.id.toString() === currentUserId ? (
                            <span className="self-text">This is you</span>
                        ) : (
                            <button className="follow-button" onClick={() => handleFollowToggle(followed.id, followed.is_following)}>
                                {followed.is_following ? 'Unfollow' : 'Follow'}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FollowList;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate, Link } from 'react-router-dom';

// const FollowList = () => {
//     const { user_id } = useParams();
//     const navigate = useNavigate();
//     const [followers, setFollowers] = useState([]);
//     const [following, setFollowing] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const currentUserId = localStorage.getItem("user_id");  // ✅ ดึง user_id ของบัญชีที่ล็อกอินอยู่

//     useEffect(() => {
//         if (!user_id) {
//             console.error('User ID is null');
//             navigate('/home');
//             return;
//         }

//         const fetchData = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 if (!token) {
//                     navigate('/login');
//                     return;
//                 }

//                 const [followersResponse, followingResponse] = await Promise.all([
//                     axios.get(`http://127.0.0.1:8000/api/users/${user_id}/followers/`, {
//                         headers: { Authorization: `Bearer ${token}` },
//                     }),
//                     axios.get(`http://127.0.0.1:8000/api/users/${user_id}/following/`, {
//                         headers: { Authorization: `Bearer ${token}` },
//                     }),
//                 ]);

//                 setFollowers(followersResponse.data);
//                 setFollowing(followingResponse.data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching data', error);
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [user_id, navigate]);

//     const handleFollowToggle = async (targetUserId, isFollowing) => {
//         try {
//             const token = localStorage.getItem('token');
//             const url = `http://127.0.0.1:8000/api/users/${targetUserId}/${isFollowing ? 'unfollow' : 'follow'}/`;

//             await axios.post(url, {}, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             // อัปเดต UI ทันทีโดยไม่ต้องรีเฟรช
//             setFollowers((prev) =>
//                 prev.map((f) => (f.id === targetUserId ? { ...f, is_following: !isFollowing } : f))
//             );
//             setFollowing((prev) =>
//                 prev.map((f) => (f.id === targetUserId ? { ...f, is_following: !isFollowing } : f))
//             );
//         } catch (error) {
//             console.error('Error toggling follow status', error);
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div style={styles.container}>
//             <h2>Followers</h2>
//             <div style={styles.list}>
//                 {followers.length === 0 ? <p>No followers yet.</p> : followers.map((follower) => (
//                     <div key={follower.id} style={styles.userCard}>
//                         <img
//                             src={follower.profile_picture || 'https://via.placeholder.com/50'}
//                             alt="Profile"
//                             style={styles.profilePicture}
//                         />
//                         <Link to={`/profile/${follower.id}`} style={styles.userName}>
//                             {follower.first_name} {follower.last_name}
//                         </Link>

//                         {/* ✅ ถ้าผู้ใช้ในลิสต์เป็นบัญชีตัวเอง แสดง "This is you" แทนปุ่ม Follow */}
//                         {follower.id.toString() === currentUserId ? (
//                             <span style={styles.selfText}>This is you</span>
//                         ) : (
//                             <button 
//                                 style={styles.followButton} 
//                                 onClick={() => handleFollowToggle(follower.id, follower.is_following)}
//                             >
//                                 {follower.is_following ? 'Unfollow' : 'Follow'}
//                             </button>
//                         )}
//                     </div>
//                 ))}
//             </div>

//             <h2>Following</h2>
//             <div style={styles.list}>
//                 {following.length === 0 ? <p>Not following anyone yet.</p> : following.map((followed) => (
//                     <div key={followed.id} style={styles.userCard}>
//                         <img
//                             src={followed.profile_picture || 'https://via.placeholder.com/50'}
//                             alt="Profile"
//                             style={styles.profilePicture}
//                         />
//                         <Link to={`/profile/${followed.id}`} style={styles.userName}>
//                             {followed.first_name} {followed.last_name}
//                         </Link>

//                         {/* ✅ ถ้าผู้ใช้ในลิสต์เป็นบัญชีตัวเอง แสดง "This is you" แทนปุ่ม Follow */}
//                         {followed.id.toString() === currentUserId ? (
//                             <span style={styles.selfText}>This is you</span>
//                         ) : (
//                             <button 
//                                 style={styles.followButton} 
//                                 onClick={() => handleFollowToggle(followed.id, followed.is_following)}
//                             >
//                                 {followed.is_following ? 'Unfollow' : 'Follow'}
//                             </button>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };
// // สไตล์สำหรับคอมโพเนนต์
// const styles = {
//     selfText: {
//         fontSize: '14px',
//         fontWeight: 'bold',
//         color: '#555',
//         marginLeft: '10px',
//     },
//     container: {
//         maxWidth: '800px',
//         margin: '0 auto',
//         padding: '20px',
//         fontFamily: 'Arial, sans-serif',
//     },
//     list: {
//         marginTop: '10px',
//     },
//     userCard: {
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginBottom: '10px',
//         padding: '10px',
//         border: '1px solid #ccc',
//         borderRadius: '8px',
//         backgroundColor: '#f9f9f9',
//     },
//     profilePicture: {
//         width: '50px',
//         height: '50px',
//         borderRadius: '50%',
//         marginRight: '10px',
//     },
//     userName: {
//         fontWeight: 'bold',
//     },
//     followButton: {
//         padding: '6px 12px',
//         backgroundColor: '#007bff',
//         color: '#fff',
//         border: 'none',
//         borderRadius: '4px',
//         cursor: 'pointer',
//     },
// };

// export default FollowList;
