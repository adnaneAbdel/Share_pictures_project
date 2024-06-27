// Frontend: Posts.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostBox from './postBox';
import './posts.css';

const FetchPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/home');
        console.log(response.data); 
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="posts-container">
      {posts.map(post => (
        <PostBox
          postId={post._id}
          title={post.title}
          description={post.description}
          imageUrl={post.imageUrl}
          userName={post.userId.name} 
          createdAt={post.createdAt}
        />
      ))}
    </div>
  );
};

export default FetchPosts;
