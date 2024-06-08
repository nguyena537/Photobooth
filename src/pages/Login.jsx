import React, {useState, useEffect} from 'react'
import './Login.css';
import logo from '../assets/photobooth logo.png'
import GoogleButton from 'react-google-button';
import { useNavigate } from 'react-router-dom';
import hideIcon from '../assets/hide-icon.png'

const Login = () => {
    const [loginInfo, setLoginInfo] = useState({email: "", password: ""});

    const [loginIncorrect, setLoginIncorrect] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigatePages = useNavigate();

    const [passwordVisibility, setPasswordVisibility] = useState(false);
    
    async function auth(){
        setLoading(true);
        const response = await fetch('https://photo-server-deplo.onrender.com/request', { method:'post' });
        const data = await response.json();

        console.log(data);
        setLoading(false);
        window.location.href = data.url;
        
    }

    const handleFormChange = (event) => {
        setLoginIncorrect(false);
        let { name, value } = event.target;

        if (name === "email") {
            setLoginInfo({...loginInfo, email: value});
        }
        else if (name === "password") {
            setLoginInfo({...loginInfo, password: value});
        }
    }

    const sendLogin = async () => {
        try {
            setLoading(true);
            setLoginIncorrect(false);
            console.log(JSON.stringify(loginInfo));
            let body = JSON.stringify(loginInfo);
            let url = "https://photo-server-deplo.onrender.com/auth/login";

            const response = await fetch(url, {
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
                    },
                });
                const profileData = await profileRes.json();
                window.location.href = `/redirect?token=${data.token}&userEmail=${profileData.user_email}&userId=${profileData.user_id}&userName=${profileData.user_username}`
            }
            else
            {
                console.log("Login incorrect.");
                setLoginIncorrect(true);
            }
            setLoading(false);
        }
        catch (err) {
            setLoading(false);
            console.log("Exception occured.");
        }
        
    }

    useEffect(() => {
        if (sessionStorage.getItem('token') != null) {
            window.location.href = "profile";
        }
    }, []);

    return (
        <div className='login-page'>
            <div className="logo-container">
                <img src={logo} alt="Photobooth Logo" className='logo'/>
            </div>
            <div className="center-div">
                <div className="login-main-container">
                    <div className="top-container-1">
                        <h2 className='title'>Log in to Photobooth</h2>
                        <div className="google-button-1">
                        <GoogleButton onClick={auth} disabled={loading}/>
                        </div>
                    </div>
                    <p className='line-break'><span>OR</span></p>
                    <div className="form-container-1">
                        <div className="forms" id='top-form'>
                            <label htmlFor="email" className='box-text'>Email Address</label> <br />
                            <input type="email" name="email" id="email" className='form-boxes' onChange={handleFormChange} required/>
                        </div>

                        <div className="forms" id='bottom-form'>
                            <div className="password-row">
                                <label htmlFor="password" className='box-text'>Password</label>
                                <button
                                    type="button"
                                    onClick={() => setPasswordVisibility(!passwordVisibility)}
                                    className="password-toggle-button"
                                >
                                    {passwordVisibility && <img src={hideIcon} alt="Hide Icon" className="hide-icon" />} {/* Display hide icon when password is visible */}
                                    {passwordVisibility ? "Hide" : "Show"}
                                </button>
                            </div>
                            <input
                                type={passwordVisibility ? "text" : "password"}
                                name="password"
                                id="password"
                                className='form-boxes'
                                onChange={handleFormChange}
                                required
                            />
                        </div>



                        <div className="submit">
                            <button type='submit' id='login-button' onClick={sendLogin} disabled={loading}>{loading ? "Loading..." : "Log in"}</button>
                        </div>

                        {loginIncorrect && <p>Username or password is incorrect.</p>}

                        <hr className="separator" />
                    </div>

                    <div className="bottom-container">
                        <p className='no-account'>Don't have an account?</p>
                        <button id="signUp-button" onClick={() => navigatePages('/signup')}>Sign Up</button>
                    </div>
                </div>
            </div>
            
        </div>
    )

}

export default Login
