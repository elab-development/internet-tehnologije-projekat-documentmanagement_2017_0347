
import React , {useState} from "react";
import {useNavigate} from 'react-router-dom';

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [department, setDept] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        props.registrate(name, email, pass,role,department); 
      //  props.authenticate(email,pass); 
        navigate("/");
    }

    return(
        <div className="auth-form-container">
            <h2>Register</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <label htmlFor = "email">email</label>
                <input value = {email} onChange={(e) => setEmail(e.target.value)} type = "email" placeholder="email" id = "email" />
                <label htmlFor = "password">password</label>
                <input value = {pass} onChange={(e) => setPass(e.target.value)} type = "password" placeholder="********" id = "password" />
                <label htmlFor = "name">name</label>
                <input value = {name} onChange={(e) => setName(e.target.value)} type = "name" placeholder="name" id = "name" />
                <label htmlFor = "role">role</label>
                <input value = {role} onChange={(e) => setRole(e.target.value)} type = "text" placeholder="role" id = "role" />
                <label htmlFor = "department">department</label>
                <input value = {department} onChange={(e) => setDept(e.target.value)} type = "text" placeholder="department" id = "department" />
                <button type="submit">Register</button>
            </form>
            <button className = "link-btn" onClick={() => props.onFormSwitch('login')}>Already have an account? Login here</button> 
        </div>
    )
}