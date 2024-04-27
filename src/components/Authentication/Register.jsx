
import React , {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('user');
    const [department, setDept] = useState();
    const [departments, setDepts] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        loadDepts(); 
    }, []);

    const handleRoleChange = (e) => {
          setRole(e.target.value);
    };

    const handleDepartmentChange = (e) => {
        setDept(e.target.value);
  };

  const loadDepts = async () => {
    try {
        const response = await axios.get('api/departments');
        setDepts(response.data);
    } catch (error) {
        console.log(error);
    }
}

    const handleSubmit =(e) => {
        e.preventDefault();
        props.registrate(name, email, pass,role,department).then(
           // () => navigate('/')
           props.onFormSwitch('login')
        ).catch((er) => {
            console.log(er);
        });
      //  props.authenticate(email,pass); 
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
                <label htmlFor="roleSelect">select role:</label>
                    <select id="roleSelect" value={role} onChange={handleRoleChange}>
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                    </select>
                <label htmlFor = "departmentSelect">department</label>
                <select id="departmentSelect" value={department} onChange={handleDepartmentChange}>
                    {departments.map(element => 
                        <option  value={element.id}>{element.name}</option>
                    )}
                </select>
                <button type="submit">Register</button>
            </form>
            <button className = "link-btn" onClick={() => props.onFormSwitch('login')}>Already have an account? Login here</button> 
        </div>
    )
}

                {/* <label htmlFor = "role">role</label>
                <input value = {role} onChange={(e) => setRole(e.target.value)} type = "text" placeholder="role" id = "role" /> */}
                {/* <input value = {department} onChange={(e) => setDept(e.target.value)} type = "text" placeholder="department" id = "department" /> */}