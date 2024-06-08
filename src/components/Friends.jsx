import React, { useState, useEffect } from 'react';
import './FriendsRec.css';
import defaultAvatar from '../assets/default avatar.png';

const FriendsRec = () => {
  const [recommendations, setRecommendations] = useState([]);
  const url = 'https://photo-server-deplo.onrender.com';

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`${url}/friend/recommendfriends`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('token')
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations);
      } else {
        console.error('Failed to fetch recommendations:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      const response = await fetch(`${url}/friend/addfriend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('token')
        },
        body: JSON.stringify({ user_0_id: userId })
      });

      if (response.ok) {
        fetchRecommendations(); // Refresh recommendations after adding a friend
      } else {
        console.error('Failed to add friend:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  return (
    <div className='friends-rec'>
      <h3>Friend Recommendations</h3>
      {recommendations.map(friend => (
        <div key={friend.user_id} className='friend-rec-item'>
          <img className='friend-avatar' src={friend.user_image ?? defaultAvatar} alt='Avatar' />
          <div className='friend-info'>
            <p className='friend-username'>@{friend.user_username}</p>
            <p className='friend-name'>{friend.user_name}</p>
          </div>
          <button className='add-friend-button' onClick={() => handleAddFriend(friend.user_id)}>Add Friend</button>
        </div>
      ))}
    </div>
  );
};

export default FriendsRec;
