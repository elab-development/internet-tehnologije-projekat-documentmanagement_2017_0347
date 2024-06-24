import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';


const ChangePassword = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [code, setCode] = useState('');
    const [confirmPass, setConfrimPass] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        props.changePass(email, code, pass, confrimPass);
    }

    return (
        <>
        <div className="auth-form-container">
            <h2>Reset Password</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="" />
                <label htmlFor="code">code</label>
                <input value={code} onChange={(e) => setCode(e.target.value)} type="string" placeholder="" />
                <label htmlFor="password">password</label>
                <input value={pass}  onChange={(e) => setPass(e.target.value)} id="password" type="password" placeholder="" />
                <label htmlFor="password2">confirm password</label>
                <input value={confirmPass}  onChange={(e) => setConfrimPass(e.target.value)} id="password2" type="password" placeholder="" />
                <button type="submit">Change password</button>
            </form>
        </div>
        </>
    )
}

export default ChangePassword;