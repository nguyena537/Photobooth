import React, { useState, useEffect } from 'react';
import './Postings.css';
import Post from '../components/Post';

import NavbarComponent from '../components/NavbarComponent';


import FriendsRec from '../components/Friends';
const Postings = () => {

  const[posts, setPosts] = useState([]);

  useEffect(()=>{
    const fetchPosts = async () => {
      try {
        let url = "https://photo-server-deplo.onrender.com";
        const response = await fetch(`${url}/post`, {
          headers: {
            Authorization: sessionStorage.getItem('token')
          }
        });
        const data = await response.json();
        setPosts(data);
        console.log(data);
      }
      catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
    <NavbarComponent currentPage="posts" />
    <div className='postings-container'>
      <div className='postings-column'>
        {posts.map(post => (
          <Post 
            //key={post.post_id} 
            postId={post.post_id} 
            user_id={post.user_id}
            username={post.user_username}
            userImage={post.user_image}
            postImage={post.post_image}
            likes={post.likes}
            caption={post.description}
            //comments={post.comments}  
          />
        ))}
      </div>
      <div className='friends-rec-column'>
          <FriendsRec /> {/* Add the FriendsRec component */}
        </div>
    </div>
    </>
    
  )
}

export default Postings;