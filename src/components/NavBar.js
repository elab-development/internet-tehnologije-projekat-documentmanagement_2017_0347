import React, {useState, useEffect} from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios'

const NavBar = () =>{

  const [departments, setDepts] = useState([]);
  
  useEffect(() => {
    loadDepts(); 
}, []);

const loadDepts = async () => {
  try {
      const response = await axios.get('api/departments');
      setDepts(response.data);
  } catch (error) {
      console.log(error);
  }}
  return (
    <div class="nav-bar">
        <NavLink className="nav-bar-item" to="/">HOME</NavLink>
        {departments.map(element => 
        <NavLink className="nav-bar-item" key={element.id} value={element.id} to={`/documents/${element.name}`  }>{element.name.toUpperCase() }</NavLink>)}
    </div>
  )
}

export default NavBar
{/*  value={element.id}
<NavLink className="nav-bar-item" to="/documents/hr">HR</NavLink>
<NavLink className="nav-bar-item" to="/documents/it">IT</NavLink>
<NavLink className="nav-bar-item" to="/documents/marketing">Marketing</NavLink>
<NavLink className="nav-bar-item" to="/documents/production" >Production</NavLink>
<NavLink className="nav-bar-item" to="/documents/finance">Finance</NavLink> 
<NavLink className="nav-bar-item" to="/documents/administration">Administration</NavLink>
<NavLink className="nav-bar-item" to="/contact">Contact</NavLink> */}