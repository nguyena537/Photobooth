import React, { useState, useEffect }  from 'react'
import './Post.css';
import defaultAvatar from '../assets/default avatar.png';
import { FcLike } from "react-icons/fc";
import { FaRegComment } from "react-icons/fa";
import defaultPhoto from '../assets/default photo.png';

import CommentList from './CommentList';
const Post = (props) => {
  const { postId, user_id, username, userImage, postImage, likes, caption, loggedInUsername } = props;
  const [likeNum, setLikes] = useState(likes);
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [isReplying, setIsReplying] = useState(false);


  const [replyText, setReplyText] = useState('');
  const url = 'https://photo-server-deplo.onrender.com';

  const handleLikes = async () => {
    try {
      const response = await fetch(`${url}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token')
        },
        body: JSON.stringify({ post_id: postId })
      });

      if (!response.ok) {
        throw new Error('Failed to update like state');
      }

      const result = await response.json();
      console.log('API response:', result); // Add debugging statement

      if (result && result.post && typeof result.post.likes !== 'undefined') {
        setClicked(!clicked);
        setLikes(result.post.likes);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error updating likes: ', error);
    }
  };


  useEffect(() => {
    fetchComments(postId, null);
  }, [postId]);

  const fetchComments = async (postId, parent_id) => {
    try {
      let a_url = `${url}/comments/${postId}`;
      if (parent_id) {
        a_url += `?parent_id=${parent_id}`;
    }
      const response = await fetch(a_url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('token')
        },
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        console.error('Failed to fetch comments:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const addComment = async (postId, comment, parentId) => {
    try {
      const commentData = {
        post_id: postId,
        comment: comment,
        parent_id: parentId,
        user_username: sessionStorage.getItem('user_username')
      };
  
      const response = await fetch(`${url}/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('token')
        },
        body: JSON.stringify(commentData), // Pass the new object to JSON.stringify
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setComments([...comments, data]);

        setIsReplying(false);
        setReplyText('');

      } else {
        console.error('Failed to add comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const updateComment = async (commentId, updatedComment) => {
    try {
      const response = await fetch(`${url}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('token')
        },
        body: JSON.stringify({ comment: updatedComment }),
      });
      if (response.ok) {
        const updatedComments = comments.map(comment => {
          if (comment.comment_id === commentId) {
            return { ...comment, comment: updatedComment };
          }
          return comment;
        });
        setComments(updatedComments);
      } else {
        console.error('Failed to update comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await fetch(`${url}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('token')
        },
      });
      if (response.ok) {
        const updatedComments = comments.filter(comment => comment.comment_id !== commentId);
        setComments(updatedComments);
      } else {
        console.error('Failed to delete comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const toggleReplyMode = () => {
    setIsReplying(!isReplying);

  };

  const handleReplyTextChange = (e) => {
    setReplyText(e.target.value);
  };
  return (
    <div className='post'>
      <div className='post-handle'>
        <a href={`http://localhost:3000/profile/${user_id}`}><img className='post-avatar' src={userImage ?? defaultAvatar} alt='Avatar'/></a>
        <p>@{username}</p>
      </div>

      <div className='post-photo'>
        <img className='post-photo-image' src={postImage ?? defaultPhoto} alt='Pic'/>
      </div>

      <div className='post-interact'>
        <FcLike className={`post-interact-heart ${clicked ? 'clicked' : ''}`} size={40} onClick={handleLikes}/>
        <FaRegComment className='post-interact-comment' size={40} onClick={toggleReplyMode}/>
        
      </div>
      {isReplying && (
        <div className='reply-field'>
          <input type="text" value={replyText} onChange={handleReplyTextChange} placeholder="Write a comment..."/>
          <button onClick={() => addComment(postId, replyText, null)} disabled={loading}>Comment</button>
        </div>
      )}
      <div className='post-text'>
        <p className="like-count">{likeNum} likes</p>
        <p><span className="post-username">{username}</span> {caption}</p>
        <CommentList
          postId={postId}
          comments={comments}
          onAddComment={(comment, parentId) => addComment(postId, comment, parentId)}
          onUpdateComment={updateComment}
          onDeleteComment={deleteComment}
          onFetchComments={fetchComments}
        />
      </div>

      
    </div>
  )
}

export default Post




