// provera da li su lozinke iste ako ne refresh?

import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';


const ChangePassword = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        props.changePass(email, pass);
    }

    return (
        <>
        <div className="auth-form-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email" />
                <label htmlFor="password">password</label>
                <input value={pass}  onChange={(e) => setPass(e.target.value)} id="password" type="password" placeholder="********" />
                <label htmlFor="password">confirm password</label>
                <input value={pass}  onChange={(e) => setPass(e.target.value)} id="password" type="password" placeholder="********" />
                <button type="submit">Change password</button>
            </form>
            <button className="link-btn" onClick={() => props.onFormSwitch('login')}>Back to login</button>
        </div>
        </>
    )
}

export default ChangePassword;
