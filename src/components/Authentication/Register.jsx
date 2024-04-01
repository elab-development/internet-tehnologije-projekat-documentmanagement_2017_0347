import React , {useState} from "react"

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [department, setDept] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    return(
        <div className="auth-form-container">
            <h2>Register</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <label htmlFor = "email">email</label>
                <input value = {email} onChange={(e) => setEmail(e.target.value)} type = "email" placeholder="email" id = "email" name = "email"/>
                <label htmlFor = "password">password</label>
                <input value = {pass} onChange={(e) => setPass(e.target.value)} type = "password" placeholder="********" id = "password" name = "password"/>
                <label htmlFor = "name">name</label>
                <input value = {name} onChange={(e) => setName(e.target.value)} type = "name" placeholder="name" id = "name" name = "name"/>
                <label htmlFor = "role">role</label>
                <input value = {role} onChange={(e) => setRole(e.target.value)} type = "role" placeholder="role" id = "role" name = "role"/>
                <label htmlFor = "department">department</label>
                <input value = {department} onChange={(e) => setDept(e.target.value)} type = "department" placeholder="department" id = "department" name = "department"/>
                <button type="submit">Register</button>
            </form>
            <button className = "link-btn" onClick={() => props.onFormSwitch('login')}>Already have an account? Login here</button> 
        </div>
    )
}