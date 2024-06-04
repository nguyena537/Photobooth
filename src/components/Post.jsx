import React, { useState } from 'react'
import './Post.css';
import defaultAvatar from '../assets/default avatar.png';
import { FcLike } from "react-icons/fc";
import { FaRegComment } from "react-icons/fa";
import defaultPhoto from '../assets/default photo.png';

const Post = (props) => {
  const { post_id, username, userImage, postImage, likes, caption, comments } = props;
  const [likeNum, setLikes] = useState(likes);
  const [clicked, setClicked] = useState(false);

  const handleLikes = async () => {
    try {
      const response = await fetch('/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token')
        },
        body: JSON.stringify({post_id})
      });

      if(!response.ok){
        throw new Error('Failed to update like state');
      }

      const result = await response.json();

      setClicked(!clicked);
      setLikes(result.post.likes);
    }
    catch (error){
      console.error('Error updating likes: ', error);
    }
  };

  return (
    <div className='post'>
      <div className='post-handle'>
        <a href={`http://localhost:3000/profile/${username}`}><img className='post-avatar' src={userImage ?? defaultAvatar} alt='Avatar'/></a>
        <p>@{username}</p>
      </div>

      <div className='post-photo'>
        <img className='post-photo-image' src={postImage ?? defaultPhoto} alt='Pic'/>
      </div>

      <div className='post-interact'>
        <FcLike className={`post-interact-heart ${clicked ? 'clicked' : ''}`} size={40} onClick={handleLikes}/>
        <FaRegComment className='post-interact-comment' size={40}/>
      </div>

      <div className='post-text'>
        <p>{likeNum} likes</p>
        <p>{caption}</p>
        <p>{comments}</p>
      </div>
    </div>
  )
}

export default Post