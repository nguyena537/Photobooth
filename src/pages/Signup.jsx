import React from 'react'
import './Signup.css';
import logo from '../assets/photobooth logo.png'

const Signup = () => {
  return (
    <div className='signup-page'>
        <div className="logo-container">
            <img src={logo} alt="Photobooth Logo" className='logo'/>
        </div>
        
        <div className="main-container">
            <div className="top-container">
                <h2 className='title'>Create an account</h2>
                <p className="login-link">Already have an account? Log in</p>
            </div>
            
            <div className="form-container">
            <div className="forms" id='top-form'>
                    <label htmlFor="profile-name" className='box-text'>What should we call you?</label> <br />
                    <input type="text" name="username" id="username" className='form-boxes' placeholder='Enter your profile name' required/>
                </div>

                <div className="forms" id='middle-form'>
                    <label htmlFor="email" className='box-text'>What's your email?</label> <br />
                    <input type="email" name="email" id="email" className='form-boxes' placeholder='Enter your email address' required/>
                </div>

                <div className="forms" id='bottom-form'>
                    <label htmlFor="password" className='box-text'>Create a password</label> <br />
                    <input type="password" name="password" id="password" className='form-boxes' placeholder='Enter your password' required/>
                    
                </div>
                <p className='password-requirements'>Use 8 or more characters with a mix of letters, numbers & symbols</p>
                <button type='submit' id='create-account-button'>Create an account</button>
            </div>
            
            <p className='line-break'><span>OR</span></p>

            <div className="bottom-container">
                <button className="google-button">Continue with Google</button>
            </div>
        </div>
    </div>
  )
}

export default Signup
