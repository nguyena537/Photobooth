import React, { useState, useEffect } from 'react'
import './Profile.css';
import logo from '../assets/photobooth logo.png';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [friends, setFriends] = useState([]);
  const [posts, setPosts] = useState([]);

  const getProfile = async () => {
    try {
      const profileRes = await fetch('./profile-mock/profile.json');
      const profileData = await profileRes.json();
      setProfile(profileData);

      const friendsRes = await fetch('./profile-mock/friends.json');
      const friendsData = await friendsRes.json();
      setFriends(friendsData.friends);

      const postsRes = await fetch('./profile-mock/posts.json');
      const postsData = await postsRes.json();
      setPosts(postsData);
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className='profile-page'>
        <div className='profile-information'>
          <img src={profile.image} alt="profile picture" className="profile-picture" />

          <div className="profile-text">
            <h1 className="profile-name">{profile.user_name}</h1>
            <h2 className="profile-username">@{profile.user_username}</h2>
            <p className="profile-bio">{profile.bio}</p>
          </div>

          <div className="profile-friends">
            <h1>{`${friends.length}`}</h1>
            <h2>Friends</h2>
          </div>
        </div>
        
        <div className="profile-posts-container">
          <div className='profile-posts'>
            {posts.map((post) => <img src={post.post_image} alt="post" className="profile-post-image" />)}
          </div>
        </div>
        
    </div>
  )
}

export default Profile;
