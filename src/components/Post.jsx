import React, { useState, useEffect }  from 'react'
import './Post.css';
import defaultAvatar from '../assets/default avatar.png';
import heartSVG from '../assets/heart interact.svg';
import commentSVG from '../assets/comment interact.svg';
import defaultPhoto from '../assets/default photo.png';

import CommentList from './CommentList';
const Post = (props) => {

  
  const { username, userImage, postImage, caption, postId } = props;
  const [comments, setComments] = useState([]);
  const [isReplying, setIsReplying] = useState(false);


  const [replyText, setReplyText] = useState('');
  const url = 'https://photo-server-deplo.onrender.com';

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
        parent_id: parentId
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
        <a href='http://localhost:3000/' alt='Change to user profile link'><img className='post-avatar' src={userImage ?? defaultAvatar} alt='Avatar'/></a>
        <p>@{username}</p>
      </div>

      <div className='post-photo'>
        <img className='post-photo-image' src={postImage} alt='Pic'/>
      </div>

      <div className='post-interact'>
        <img className='post-interact-heart' src={heartSVG} alt='Heart Interact'/>
               <img className='post-interact-comment' src={commentSVG} alt='Comment Interact' onClick={toggleReplyMode}/>
      </div>
      {isReplying && (
        <div className='reply-field'>
          <input type="text" value={replyText} onChange={handleReplyTextChange} placeholder="Write a reply..."/>
          <button onClick={() => addComment(postId, replyText, null)}>Reply</button>
        </div>
      )}
      <div className='post-text'>

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




