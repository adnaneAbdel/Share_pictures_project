import React, { useState, useEffect } from "react";
import './posts.css';
import axios from 'axios';
import defaultUser from '../dashborad/images/defaultUser.png';
import ImageModal from "./imageModal/ImageModal";

const PostBox = ({ postId, title, description, imageUrl, userName, createdAt ,profilePicture}) => {
    const [likes, setLikes] = useState(0);
    const [likedUsers, setLikedUsers] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
    const [token, setToken] = useState(localStorage.getItem('token')); 

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
                    setLikes(response.data.likesCount || 0);
                    setLikedUsers(response.data.likedUsers || []);
                    setIsLiked(response.data.alreadyLiked || false);
                } else {
                    // Fetch only likes count for non-authenticated users
                    const storedLikesCount = localStorage.getItem(`likesCount_${postId}`);
                    if (storedLikesCount !== null) {
                        setLikes(parseInt(storedLikesCount));
                    } else {
                        const response = await axios.get(`http://localhost:3000/api/auth/post/${postId}/like/count`);
                        setLikes(response.data.likesCount || 0);
                    }
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
                // Handle scenario where user is not authenticated (visitor mode)
                console.log('Visitor mode: cannot like post without authentication');
                return;
            }

            const response = await axios.post(`http://localhost:3000/api/auth/post/${postId}/likes`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                // Update likes count and state
                const newLikesCount = likes + 1;
                setLikes(newLikesCount);
                setIsLiked(true);

               
                localStorage.setItem(`likesCount_${postId}`, newLikesCount);
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
                    <img src={defaultUser } alt='' className='imgPorfil' />
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
                {token && ( // Render the like button only if token exists
                    <button className='LikesButton' onClick={handleLike} disabled={isLiked}>
                        {isLiked ? 'Liked' : 'Like'}
                    </button>
                )}
                <div className="counterLikes">
                    <span className="numberOfLikes">{likes}</span> <span>{likes === 1 ? 'Like' : 'Likes'}</span>
                </div>
                {token && ( // Render the dropdown only if token exists
                    <div className="dropdown">
                        <button className="dropdown-toggle" onClick={toggleDropdown}>
                            Liked by {likedUsers.length > 0 ? likedUsers[0] : 'nobody'}
                        </button>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                {likedUsers.map((name, index) => (
                                    <div key={index}>{name}</div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            {isModalOpen && <ImageModal imageUrl={imageUrl} onClose={closeModal} />}
        </div>
    );
}

export default PostBox;
