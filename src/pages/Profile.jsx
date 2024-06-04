import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import ReactLoading from "react-loading";
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
  const [isFriend, setIsFriend] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [tempBio, setTempBio] = useState("");
  const [previewPostImg, setPreviewPostImg] = useState(null);
  const { userId } = useParams();
  const isLoggedInUserProfile = (userId == null || userId == sessionStorage.getItem('user_id'));
  

  const getProfile = async () => {
    setPageLoading(true);
    try {
      let url = "https://photo-server-deplo.onrender.com";
      // const profileRes = await fetch('./profile-mock/profile.json');
      const profileRes = await fetch(`${url}/profile${userId ? `/user/${userId}` : ""}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('token')
        },
      });
      const profileData = await profileRes.json();
      setProfile(profileData);
      setTempBio(profileData.bio);

      // const friendsRes = await fetch('./profile-mock/friends.json');
      const friendsRes = await fetch(`${url}/friend/getfriends${!isLoggedInUserProfile ? `/${userId}` : ""}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('token')
        },
      });
      const friendsData = await friendsRes.json();
      setFriends(friendsData.friends);
      console.log(friendsData.friends);
      setIsFriend(friendsData.friends.some(f => f.user_id == sessionStorage.getItem("user_id")));

      // const postsRes = await fetch('./profile-mock/posts.json');
      const postsRes = await fetch(`${url}/post/user/${profileData.user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('token')
        },
      });
      const postsData = await postsRes.json();
      setPosts(postsData);
      setPageLoading(false);
    }
    catch (err) {
      console.log(err);
    }
  }

  const handleEditProfileSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (event.target.profilePic.files.length > 0) {
      let url = "https://photo-server-deplo.onrender.com/upload";

      let formData = new FormData();
      formData.append('file', event.target.profilePic.files[0]);
      const uploadRes = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': sessionStorage.getItem('token')
        },
        body: formData
      });
    }

    if (event.target.bio.value != null && profile.bio !== tempBio) {
      let url = "https://photo-server-deplo.onrender.com/profile/bio";
      
      let bio = JSON.stringify({bio: tempBio});
      const bioRes = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': "application/json",
          'Authorization': sessionStorage.getItem('token')
        },
        body: bio
      });
      
    }

    setLoading(false);
    window.location.href = "";
  }

  const handleAddPostSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    let url = "https://photo-server-deplo.onrender.com/post";

    let formData = new FormData();
    formData.append('description', event.target.caption.value);
    formData.append('file', event.target.postImg.files[0]);
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

  const friendClicked = async () => {
    setLoading(true);
    let url = "https://photo-server-deplo.onrender.com/friend/addfriend";
    let data = JSON.stringify({user_0_id: profile.user_id});
    console.log(url, data);
    const postRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem('token')
      },
      body: data
    });

    if (postRes.status == 200) {
      setIsFriend(true);
      setFriends([...friends, {user_iduser_email: profile.user_email, user_name: profile.user_name}])
    }
    else {
      console.log("friend failed");
    }
    setLoading(false);
  }

  const unfriendClicked = async () => {
    setLoading(true);
    let url = "https://photo-server-deplo.onrender.com/friend/removefriend";
    const unfriendRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem('token')
      },
      body: JSON.stringify({user_0_id: profile.user_id})
    });

    if (unfriendRes.status == 200) {
      setIsFriend(false);
    }
    else {
      console.log("unfriend failed");
    }
    setLoading(false);
  }

  const unfriendClickedFriendsList = async (user_id) => {
    setLoading(true);
    let url = "https://photo-server-deplo.onrender.com/friend/removefriend";
    const unfriendRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem('token')
      },
      body: JSON.stringify({user_0_id: user_id})
    });

    if (unfriendRes.status == 200) {
      setFriends(friends.filter(f => f.user_id != user_id));
    }
    else {
      console.log("unfriend failed");
    }
    setLoading(false);
  }

  const postImgChange = (event) => {
    console.log(event.target.files);
    if (event.target.files != null) {
      setPreviewPostImg(URL.createObjectURL(event.target.files[0]));
    }
    else {
      setPreviewPostImg(null);
    }
    
  }

  useEffect(() => {
    if (sessionStorage.getItem('token') == null) {
      window.location.href = "/";
      return;
    }
    getProfile();
  }, [isFriend]);

  return (
    <div className='profile-page'>
        {!pageLoading ? 
        <div>
        <div className='profile-information'>
          {isLoggedInUserProfile ? 
          <Popup trigger={<img src={profile.user_image ?? defaultAvatar} alt="profile pic" className="profile-picture" title="Edit profile" />} 
                 position="right center" contentStyle={{ width: '1000px', padding: '50px' }} modal>
            <div className="edit-profile">
              <h1>Edit Profile</h1>
              <form className="edit-profile-form" onSubmit={handleEditProfileSubmit}>
                <label>Profile Picture</label>              
                <input type="file" id="profilePic" name="profilePic" accept="image/*" />
{/* 
                <br /><br />

                <label>Name</label>
                <input type="text" placeholder={profile.user_name}/>

                <br /><br />

                <label>Username</label>
                <input type="text" placeholder={profile.user_username}/> */}

                <br /><br />

                <label>Bio</label>
                <input type="text" name="bio" onChange={(event) => setTempBio(event.target.value)} value={tempBio} className="edit-profile-bio-input" />

                <br /><br />

                <input type="submit" name="submit" value={loading ? "Loading..." : "Submit"} disabled={loading} className="submit-button" />
              </form>
            </div>  
          </Popup>
          :
          <img src={profile.user_image ?? defaultAvatar} alt="profile pic" className="profile-picture-not-owner" />
          }

          <div className="profile-text">
            <h1 className="profile-name">{profile.user_name}</h1>
            <h2 className="profile-username">@{profile.user_username}</h2>
            <p className="profile-bio">{profile.bio}</p>
            {!isLoggedInUserProfile && (!isFriend ? <button className="friend-button" onClick={friendClicked} disabled={loading}>{loading ? "Loading..." : "Friend"}</button> : <button className="friend-button unfriend-button" onClick={unfriendClicked} disabled={loading}>{loading ? "Loading..." : "Unfriend"}</button>)}
            {isLoggedInUserProfile && 
            <Popup trigger={<button className="edit-profile-button">Edit Profile</button>} 
                 position="right center" contentStyle={{ width: '1000px', padding: '50px' }} modal>
              <div className="edit-profile">
                <h1>Edit Profile</h1>
                <form className="edit-profile-form" onSubmit={handleEditProfileSubmit}>
                  <label>Profile Picture</label>              
                  <input type="file" id="profilePic" name="profilePic" accept="image/*" />

                  <br /><br />

                  <label>Bio</label>
                  <input type="text" name="bio" onChange={(event) => setTempBio(event.target.value)} value={tempBio} className="edit-profile-bio-input" />

                  <br /><br />

                  <input type="submit" name="submit" value={loading ? "Loading..." : "Submit"} disabled={loading} className="submit-button" />
                </form>
              </div>  
            </Popup>}
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
                    <div className="friend-information" onClick={() => window.location.href=`/profile/${friend.user_id}`}>
                      <img src={friend.user_image ?? defaultAvatar} alt="profile pic" className="friend-picture" />
                      <p><span className="friend-name">{friend.user_name}</span> <span className="friend-username">@{friend.user_username}</span></p>
                    </div>
                    {isLoggedInUserProfile && <button className="friends-unfriend-button" onClick={() => unfriendClickedFriendsList(friend.user_id)} disabled={loading}>{loading ? "Loading..." : "Unfriend"}</button>}
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
              posts.length > 0 ? 
              posts.map((post) => 
                    <Popup trigger={<img src={post.post_image} alt="post" className="profile-post-image" />} position="right center" contentStyle={{ width: '512px' }} modal>
                      <Post
                        post_id={post.post_id}
                        username={post.user_userusername}
                        postImage={post.post_image}
                        userImage={post.user_image}
                        caption={post.description}
                        likes={post.likes} 
                        comments={post.comments}
                    />
                    </Popup>
              ) : <h1>No posts</h1> : <h1>No posts</h1>
            }
          </div>
        </div>

        {isLoggedInUserProfile && <Popup trigger={<button className="add-post-button">+</button>} position="right center" contentStyle={{ width: '512px', padding: '50px' }} onClose={() => setPreviewPostImg(null)} modal>
          <div className="add-post">
            <h1>Add Post</h1>
            <form className="add-post-form" onSubmit={handleAddPostSubmit}>
              <label>Image</label>              
              <input type="file" id="postImg" name="postImg" accept="image/*" onChange={postImgChange} />
              {previewPostImg != null && <div><br /><img src={previewPostImg} className="preview-post-img" /></div>}
              <br /><br />

              <label>Caption</label>
              <input type="text" name="caption" />

              <br /><br />

              <input type="submit" name="submit" value={loading ? "Loading..." : "Submit"} disabled={loading} className="submit-button" />
            </form>
          </div>
        </Popup>
        }

        <div className="space" />
        </div>
        : <div class="page-loading"><ReactLoading type="spin" color="#232323"
        height={100} width={50} /></div>}
    </div>
  )
}

export default Profile;
