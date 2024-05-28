import React from 'react'
import './Postings.css';
import Post from '../components/Post';

const Postings = () => {
  return (
    <div className='postings-row'>
        <Post/>
        <Post/>
        <Post/>
    </div>
  )
}

export default Postings