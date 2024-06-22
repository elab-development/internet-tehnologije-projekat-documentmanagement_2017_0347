import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';


export const Login = (props) => {

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [attempt, setAttempt] = useState(1);
    const [authSuccess, setAuthSuccess] = useState(true);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        props.authenticate(email, pass).then(

            () => navigate('/')
        ).catch(() => {

            setAttempt(attempt + 1);
            console.log(attempt);
            setAuthSuccess(false);
            if (attempt > 3) { props.onFormSwitch('change-pass'); }
            // props.onFormSwitch('login');
        });
    }
    return (
        <div className="auth-form-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                {!authSuccess &&
                    <p className='unsuccessful'>Username or password is not correct.</p>
                }
                <label htmlFor="email">email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email" id="email" name="email" />
                <label htmlFor="password">password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <button type="submit">Log In</button>
            </form>
            <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here</button>
            <button className="link-btn" onClick={() => props.onFormSwitch('change-pass')}>Forgot password? Change it</button>
        </div>
    )
}