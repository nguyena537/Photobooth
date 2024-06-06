// CommentList.js
import React from 'react';
import Comment from './Comment';
import './CommentList.css';

const CommentList = ({ postId, comments, onAddComment, onUpdateComment, onDeleteComment, onFetchComments }) => {

  return (
    <div className='comment-list'>
      {comments.map(comment => (
        <Comment
          postId={postId}
          key={comment.comment_id}
          onAddComment={onAddComment}

          comment={comment}
          onCommentUpdate={onUpdateComment}
          
          onCommentDelete={onDeleteComment}
          onFetchComments={onFetchComments}
        />
      ))}
    </div>
  );
};

export default CommentList;
