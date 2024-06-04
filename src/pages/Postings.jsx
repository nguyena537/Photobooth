import React, { useState, useEffect } from 'react';
import './Postings.css';
import Post from '../components/Post';

const Postings = () => {

  const[posts, setPosts] = useState([]);

  useEffect(()=>{
    const fetchPosts = async () => {
      try {
        const response = await fetch('/post');
        const data = await response.json();
        setPosts(data);
      }
      catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className='postings-row'>
      {posts.map(post => (
        <Post 
          key={post.post_id} 
          post_id={post.post_id} 
          username={post.user_username}
          userImage={post.user_image}
          postImage={post.post_image}
          likes={post.likes}
          caption={post.description}
          comments={post.comments}  
        />
      ))}
    </div>
  )
}

export default Postings;