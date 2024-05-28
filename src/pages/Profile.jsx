import React, { useState, useEffect } from 'react'
import logo from '../assets/photobooth logo.png';
import Popup from 'reactjs-popup';
import Post from '../components/Post';
import 'reactjs-popup/dist/index.css';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [friends, setFriends] = useState([]);
  const [posts, setPosts] = useState([]);
  const isLoggedInUserProfile = true;

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
          {isLoggedInUserProfile ? 
          <Popup trigger={<img src={profile.image} alt="profile pic" className="profile-picture" title="Edit profile" />} 
                 position="right center" contentStyle={{ width: '1000px', padding: '50px' }} modal>
            <div className="edit-profile">
              <h1>Edit Profile</h1>
              <form className="edit-profile-form">
                <label>Profile Picture</label>              
                <input type="file" id="img" name="img" accept="image/*" />

                <br /><br />

                <label>Name</label>
                <input type="text" placeholder={profile.user_name}/>

                <br /><br />

                <label>Username</label>
                <input type="text" placeholder={profile.user_username}/>

                <br /><br />

                <label>Bio</label>
                <input type="text" placeholder={profile.bio} className="edit-profile-bio-input" />
              </form>
            </div>  
          </Popup>
          :
          <img src={profile.image} alt="profile pic" className="profile-picture-not-owner" />
          }

          <div className="profile-text">
            <h1 className="profile-name">{profile.user_name}</h1>
            <h2 className="profile-username">@{profile.user_username}</h2>
            <p className="profile-bio">{profile.bio}</p>
            {!isLoggedInUserProfile && <button className="friend-button unfriend-button">Friend</button>}
          </div>
          
          <Popup trigger={<div className="profile-friends">
                            <h1 className="profile-friends-count">{`${friends.length}`}</h1>
                            <h2 className="profile-friends-label">Friends</h2>
                          </div>} 
                 position="right center" contentStyle={{ width: '700px' }} modal>
            <div className="friends">
              {friends.map((friend) => 
                  <div className="friend-section">
                    <hr />
                    <div className="friend-information">
                      <img src={profile.image} alt="profile pic" className="friend-picture" />
                      <p><span className="friend-name">{friend.user_name}</span> <span className="friend-username">@{friend.user_username}</span></p>
                    </div>
                    {isLoggedInUserProfile && <button className="friends-unfriend-button">Unfriend</button>}
                  </div>
                )
              }
            <hr />
            </div>
            
          </Popup>
        </div>
        
        <div className="profile-posts-container">
          <div className='profile-posts'>
            {posts.map((post) => 
                <Popup trigger={<img src={post.post_image} alt="post" className="profile-post-image" />} position="right center" contentStyle={{ width: '512px' }} modal>
                  <Post
                    username={post.user_name}
                    postImage={post.post_image}
                    userImage={post.user_image} 
                  />
                </Popup>
              )
            }
          </div>
        </div>

        <div className="space" />
        
    </div>
  )
}

export default Profile;
