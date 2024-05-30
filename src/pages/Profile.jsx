import React, { useState, useEffect } from 'react'
import logo from '../assets/photobooth logo.png';
import Popup from 'reactjs-popup';
import Post from '../components/Post';
import 'reactjs-popup/dist/index.css';
import './Profile.css';
import defaultAvatar from '../assets/default avatar.png';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [friends, setFriends] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  let isLoggedInUserProfile = true;

  const getProfile = async () => {
    try {
      let url = "https://photo-server-deplo.onrender.com";
      
      // const profileRes = await fetch('./profile-mock/profile.json');
      const profileRes = await fetch(`${url}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('token')
        },
      });
      const profileData = await profileRes.json();
      setProfile(profileData[0]);

      // const friendsRes = await fetch('./profile-mock/friends.json');
      const friendsRes = await fetch(`${url}/friend/getfriends`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('token')
        },
      });
      const friendsData = await friendsRes.json();
      setFriends(friendsData.friends);

      // const postsRes = await fetch('./profile-mock/posts.json');
      const postsRes = await fetch(`${url}/post/user/${profileData[0].user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('token')
        },
      });
      const postsData = await postsRes.json();
      console.log(postsData);
      setPosts(postsData);
    }
    catch (err) {
      console.log(err);
    }
  }

  const handleEditProfileSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    let url = "https://photo-server-deplo.onrender.com/upload";

    let formData = new FormData();
    formData.append('file', event.target.img.files[0]);
    const uploadRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': sessionStorage.getItem('token')
      },
      body: formData
    });
    setLoading(false);
    window.location.href = "/profile";
  }

  const handleAddPostSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    let url = "https://photo-server-deplo.onrender.com/post";

    let formData = new FormData();
    formData.append('description', event.target.caption.value);
    formData.append('file', event.target.img.files[0]);
    const postRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': sessionStorage.getItem('token')
      },
      body: formData
    });
    setLoading(false);
    window.location.href = "/profile";
  }

  useEffect(() => {
    if (sessionStorage.getItem('token') == null) {
      window.location.href = "/";
      return;
    }
    getProfile();
    isLoggedInUserProfile = (sessionStorage.getItem('user_id') == profile.user_id);
  }, []);

  return (
    <div className='profile-page'>
        <div className='profile-information'>
          {isLoggedInUserProfile ? 
          <Popup trigger={<img src={profile.user_image ?? defaultAvatar} alt="profile pic" className="profile-picture" title="Edit profile" />} 
                 position="right center" contentStyle={{ width: '1000px', padding: '50px' }} modal>
            <div className="edit-profile">
              <h1>Edit Profile</h1>
              <form className="edit-profile-form" onSubmit={handleEditProfileSubmit}>
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

                <br /><br />

                <input type="submit" name="submit" value={loading ? "Loading..." : "Submit"} disabled={loading} />
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
            {posts.length > 0 ? 
              posts.map((post) => 
                  <Popup trigger={<img src={post.post_image} alt="post" className="profile-post-image" />} position="right center" contentStyle={{ width: '512px' }} modal>
                    <Post
                      username={post.user_username}
                      postImage={post.post_image}
                      userImage={post.user_image} 
                      caption={post.description}
                    />
                  </Popup>
              ) : <h1>No posts</h1>
            }
          </div>
        </div>

        <Popup trigger={<button className="add-post-button">+</button>} position="right center" contentStyle={{ width: '512px', padding: '50px' }} modal>
          <div className="add-post">
            <h1>Add Post</h1>
            <form className="edit-profile-form" onSubmit={handleAddPostSubmit}>
              <label>Image</label>              
              <input type="file" id="img" name="img" accept="image/*" />

              <br /><br />

              <label>Caption</label>
              <input type="text" name="caption" />

              <br /><br />

              <input type="submit" name="submit" value={loading ? "Loading..." : "Submit"} disabled={loading} />
            </form>
          </div>
        </Popup>

        <div className="space" />
        
    </div>
  )
}

export default Profile;
