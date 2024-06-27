import React, { useState, useEffect } from "react";
import './posts.css';
import axios from 'axios';
import defaultUser from '../dashborad/images/defaultUser.png';
import ImageModal from "./imageModal/ImageModal";

const PostBox = ({ postId, title, description, imageUrl, userName, createdAt, profilePicture }) => {
    const [likes, setLikes] = useState(0);
    const [likedUsers, setLikedUsers] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                if (token) {
                    // Fetch detailed likes information for authenticated users
                    const response = await axios.get(`http://localhost:3000/api/auth/post/${postId}/like`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const { likesCount, likedUsers, userId } = response.data;
                    setLikes(likesCount || 0);
                    setLikedUsers(likedUsers || []);
                    setIsLiked(likedUsers.some(like => like.userId === userId));
                } else {
                    // Fetch only likes count for unauthenticated users
                    const response = await axios.get(`http://localhost:3000/api/auth/post/${postId}/like/count`);
                    setLikes(response.data.likesCount || 0);
                }
            } catch (error) {
                console.error('Error fetching likes:', error);
            }
        };

        fetchLikes();
    }, [postId, token]);

    const handleLike = async () => {
        try {
            if (!token) {
                console.log('Visitor mode: cannot like post without authentication');
                return;
            }

            const response = await axios.post(`http://localhost:3000/api/auth/post/${postId}/likes`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                const updatedLikes = response.data.likes;
                const userId = response.data.userId;
                setLikes(updatedLikes.length);
                setLikedUsers(updatedLikes);
                setIsLiked(!isLiked);
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="CenterSection">
            <div className='alldivProfil'>
                <div className='profil'>
                    <img src={profilePicture || defaultUser} alt='' className='imgPorfil' />
                </div>
                <div className='info'>
                    <span className='numProfil'>{userName}</span><br />
                    <span className='datePublish'>
                        Publish At: <span>{new Date(createdAt).toLocaleString()}</span>
                    </span>
                </div>
            </div>
            <div className="title">{title}</div>
            <div className="description">{description}</div>
            <img src={`http://localhost:3000/${imageUrl}`} alt='' className='testing' onClick={openModal} />
            <hr className='lineOfLike' />
            <div className='forLikeSection'>
                {token && (
                    <button className='LikesButton' onClick={handleLike}>
                        {isLiked ? 'Unlike' : 'Like'}
                    </button>
                )}
                <div className="counterLikes">
                    <span className="numberOfLikes">{likes}</span> <span>{likes === 1 ? 'Like' : 'Likes'}</span>
                </div>
                {token && likedUsers.length > 0 && (
                    <div className="dropdown">
                        <button className="dropdown-toggle" onClick={toggleDropdown}>
                            Liked by {likedUsers.length > 0 ? likedUsers[0].name : 'nobody'}
                        </button>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                {likedUsers.map((user, index) => (
                                    <div key={index}>{user.name}</div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            {isModalOpen && <ImageModal imageUrl={imageUrl} onClose={closeModal} />}
        </div>
    );
};

export default PostBox;
