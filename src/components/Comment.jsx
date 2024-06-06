import React, { useState, useEffect } from 'react';
import './Comment.css';
import CommentList from './CommentList';

const Comment = ({ postId, comment }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const isLoggedInUserProfile = sessionStorage.getItem('user_id')
  const [replyText, setReplyText] = useState('');
  const [updatedComment, setUpdatedComment] = useState(comment.comment);
  const [showChildComments, setShowChildComments] = useState(false);
  const [childComments, setChildComments] = useState([]);
    const baseUrl = 'https://photo-server-deplo.onrender.com';

  const fetchComments = async (postId, parent_id) => {
    
    
    try {
      let url = `${baseUrl}/comments/${postId}`;
      if (parent_id) {
        url += `?parent_id=${parent_id}`;
      }
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('token')
        }
      });
      if (response.ok) {
        const data = await response.json();
        setChildComments(data);
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
  
      const response = await fetch(`${baseUrl}/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('token')
        },
        body: JSON.stringify(commentData)
      });
      if (response.ok) {
        const data = await response.json();
        setChildComments([...childComments, data]);
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
      const response = await fetch(`${baseUrl}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('token')
        },
        body: JSON.stringify({ comment: updatedComment }),
      });
      if (response.ok) {
        
      } else {
        setUpdatedComment(comment.comment);
        console.error('Failed to update comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await fetch(`${baseUrl}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('token')
        }
      });
      if (response.ok) {
        const updatedComments = childComments.filter(comment => comment.comment_id !== commentId);
        setChildComments(updatedComments);
      } else {
        console.error('Failed to delete comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const toggleChildComments = async () => {
    if (!showChildComments) {
      await fetchComments(postId, comment.comment_id);
    }
    setShowChildComments(!showChildComments);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsEditing(false);
    await updateComment(comment.comment_id, updatedComment);
  };

  const handleDelete = async () => {
    await deleteComment(comment.comment_id);
  };

  const handleReply = async () => {
    await addComment(postId, replyText, comment.comment_id);
  };

  useEffect(() => {
    if (showChildComments) {
      fetchComments(postId, comment.comment_id);
    }
  }, [showChildComments]);

  return (
    <div className='comment'>
      {(
        <>
          <p className='comment-text'>{updatedComment?updatedComment:comment.comment}</p>
          <div className='comment-btns'>
            { (comment.user_id === isLoggedInUserProfile)&&
            <>
                <button className='comment-reply-btn' onClick={handleEdit}>Edit</button>
                <button className='comment-delete-btn' onClick={handleDelete}>Delete</button>
            </>
            }
            <button className='comment-child-btn' onClick={toggleChildComments}>
              {showChildComments ? 'Hide replies' : 'Show replies'}
            </button>
          </div>
          {isEditing ? (
            <>
              <textarea className='comment-edit-textarea' value={updatedComment} onChange={(e) => setUpdatedComment(e.target.value)} />
              <button className='comment-save-btn' onClick={handleSave}>Save</button>
            </>
          ) : (
            <>
              <textarea className='comment-reply-textarea' value={replyText} onChange={(e) => setReplyText(e.target.value)} />
              <button className='comment-reply-btn' onClick={handleReply}>Reply</button>
            </>
          )}
          {showChildComments && (
            <div className='child-comments'>
              <CommentList
                postId={postId}
                comments={childComments}
                onAddComment={addComment}
                onCommentUpdate={updateComment}
                onCommentDelete={deleteComment}
                onFetchComments={fetchComments}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Comment;
