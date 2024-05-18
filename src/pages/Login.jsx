import React from 'react'
import './Login.css';
import logo from '../assets/photobooth logo.png'

const Login = () => {
  return (
    <div className='login-page'>
        <div className="logo-container">
            <img src={logo} alt="Photobooth Logo" className='logo'/>
        </div>
        
        <div className="main-container">
            <div className="top-container">
                <h2 className='title'>Log in to Photobooth</h2>
                <button className="google-button">Continue with Google</button>
            </div>
            <p className='line-break'><span>OR</span></p>
            <div className="form-container">
                <div className="forms" id='top-form'>
                    <label htmlFor="email" className='box-text'>Email Address</label> <br />
                    <input type="email" name="email" id="email" className='form-boxes' required/>
                </div>

                <div className="forms" id='bottom-form'>
                    <label htmlFor="password" className='box-text'>Password</label> <br />
                    <input type="password" name="password" id="password" className='form-boxes' required/>
                </div>
                <button type='submit' id='login-button'>Log in</button>

                <hr className="separator" />
            </div>

            <div className="bottom-container">
                <p className='no-account'>Don't have an account?</p>
                <button id="signUp-button">Sign Up</button>
            </div>
        </div>
    </div>
  )
}

export default Login
