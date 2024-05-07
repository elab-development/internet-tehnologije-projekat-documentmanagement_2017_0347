import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';


const ForgotPassword = (props) => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        props.sendCode(email);
    }

    return (
        <>
        <div className="auth-form-container">
            <h2>Forgot password?</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email" />
                <button type="submit">Send code</button>
            </form>
            <button className="link-btn" onClick={() => props.onFormSwitch('reset-password')}>Reset password</button>
        </div>
        </>
    )
}

export default ForgotPassword