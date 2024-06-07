import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectPage = () => {
    const navigate = useNavigate();
    const hourInMilliseconds = 60 * 60 * 1000;
    
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const userEmail = params.get('userEmail');
        const userId = params.get('userId');
        const username = params.get('userName');
        console.log(token, userEmail, userId);

        
        // Store token and userEmail in sessionStorage or localStorage as needed
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userEmail', userEmail);
        sessionStorage.setItem('user_id', userId);
        sessionStorage.setItem('user_username', username);

        const now = new Date();
        sessionStorage.setItem('expiry_date', now.getTime() + hourInMilliseconds);

        // Ensure the session storage is set before redirecting
        setTimeout(() => {
            window.location.href = "profile";
        }, 100); 
    }, [navigate]);

    return (
        <div>
            <p>Redirecting...</p>
        </div>
    );
};

export default RedirectPage;
