// provera da li su lozinke iste ako ne refresh?

import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';


const ForgotPassword = (props) => {
    const [email, setEmail] = useState('');
    // const [code, setCode] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        props.sendCode(email);
    }

    return (
        <>
            <div className="auth-form-container">
                <h2>Forgotten password</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email" />
                    <button type="submit"  onClick={() => props.onFormSwitch('reset-password')}>Send code</button>
                </form>
                <button className="link-btn" onClick={() => props.onFormSwitch('login')}>Back to login</button>
            </div>
        </>
    )
}

export default ForgotPassword;

{/* <label htmlFor="password">password</label>
<input value={pass}  onChange={(e) => setPass(e.target.value)} id="password" type="password" placeholder="********" />
<label htmlFor="otpCode">code</label>
<input value={code}  onChange={(e) => setCode(e.target.value)} id="otpCode" type="text"  /> */}
