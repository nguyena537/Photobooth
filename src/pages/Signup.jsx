import React, {useState, useEffect} from 'react'
import './Signup.css';
import logo from '../assets/photobooth logo.png'
import { useNavigate } from 'react-router-dom';
import GoogleButton from 'react-google-button';
import hideIcon from '../assets/hide-icon.png';


const Signup = () => {
    const [signupInfo, setSignupInfo] = useState({ name: "", username: "", email: "", password: ""});
    const [loading, setLoading] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [signupFailed, setSignupFailed] = useState(false);
    const [emailExists, setEmailExists] = useState(false);

    const navigatePages = useNavigate();
    
    async function auth(){
        setLoading(true);
        const response = await fetch('https://photo-server-deplo.onrender.com/request', { method:'post' });
        const data = await response.json();

        console.log(data);
        setLoading(false);
        window.location.href = data.url;
        
    }

    const handleFormChange = (event) => {
        let { name, value } = event.target;
        setSignupInfo({ ...signupInfo, [name]: value});
        setSignupFailed(false);
        setEmailExists(false);
    }

    const handleSignup = async () => {
        try {
            console.log(signupInfo)
            setLoading(true);
            const body = JSON.stringify(signupInfo);
            const response = await fetch("https://photo-server-deplo.onrender.com/auth/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body
            });

            if (response.status === 200) {
                const data = await response.json();

                const profileRes = await fetch("https://photo-server-deplo.onrender.com/profile", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': data.token
                    }
                });

                const profileData = await profileRes.json();

                window.location.href = `/redirect?token=${data.token}&userEmail=${signupInfo.email}&userId=${profileData.user_id}&userName=${signupInfo.username}`;
            } else if (response.status === 401){
                console.log("Email exists.");
                setEmailExists(true);
            } else {
                console.log("Signup failed.");
                setSignupFailed(true);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error during signup:", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (sessionStorage.getItem('token') != null) {
            window.location.href = "profile";
        }
    }, []);

  return (
    <div className='signup-page'>
        <div className="logo-container">
            <img src={logo} alt="Photobooth Logo" className='logo'/>
        </div>
        
        <div className="center-div">
            <div className="signup-main-container">
                <div className="top-container">
                    <h2 className='title'>Create an account</h2>
                    <p className="login-link">Already have an account? <span className='login-redirect' onClick={() => navigatePages('/')}>Log in</span></p>
                </div>
                
                <div className="form-container">
                    <div className="forms" id='top-form'>
                        <label htmlFor="profile-name" className='box-text'>What is your full name?</label> <br />
                        <input type="text" name="name" id="name" className='form-boxes' placeholder='Full name' onChange={handleFormChange} required/>
                    </div>

                    <div className="forms" id='top-form'>
                        <label htmlFor="profile-name" className='box-text'>What should we call you?</label> <br />
                        <input type="text" name="username" id="username" className='form-boxes' placeholder='Enter your profile name' onChange={handleFormChange} required/>
                    </div>

                    <div className="forms" id='middle-form'>
                        <label htmlFor="email" className='box-text'>What's your email?</label> <br />
                        <input type="email" name="email" id="email" className='form-boxes' placeholder='Enter your email address' onChange={handleFormChange} required/>
                    </div>

                    <div className="forms" id='bottom-form'>
                            <div className="password-row">
                                <label htmlFor="password" className='box-text'>Create a password</label>
                                <button
                                    type="button"
                                    onClick={() => setPasswordVisibility(!passwordVisibility)}
                                    className="password-toggle-button"
                                >
                                    {passwordVisibility ? (
                                        <>
                                            <img src={hideIcon} alt="Hide" className="hide-icon" />
                                            Hide
                                        </>
                                    ) : "Show"}
                                </button>
                            </div>
                            <input
                                type={passwordVisibility ? "text" : "password"}
                                name="password"
                                id="password"
                                className='form-boxes'
                                placeholder='Enter your password'
                                onChange={handleFormChange}
                                required
                            />
                        </div>
                        <p className='password-requirements'></p>
                        <button
                            type='button'
                            id='create-account-button'
                            onClick={handleSignup}
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Create an account"}
                        </button>
                        {signupFailed && <p>Signup failed</p>}
                        {emailExists && <p>An account with this email already exists</p>}
                    </div>            
                <p className='line-break'><span>OR</span></p>

                <div className="bottom-container">
                    <GoogleButton className="google-button" onClick={auth} disabled={loading}/>
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default Signup
