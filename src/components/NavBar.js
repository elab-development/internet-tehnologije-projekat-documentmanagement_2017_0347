import React from 'react'
import { Link } from 'react-router-dom'

// <input type="text" placeholder="Search.."></input>
const NavBar = () =>{
  return (
    <div class="nav-bar">
        <Link className="nav-bar-item" to="/">Home</Link>
        <Link className="nav-bar-item" to="/documents/hr">HR</Link>
        <Link className="nav-bar-item" to="/documents/it">IT</Link>
        <Link className="nav-bar-item" to="/documents/marketing">Marketing</Link>
        <Link className="nav-bar-item" to="/documents/production" >Production</Link>
        <Link className="nav-bar-item" to="/documents/finance">Finance</Link>
        <Link className="nav-bar-item" to="/documents/administration">Administration</Link>
        <Link className="nav-bar-item" to="/contact">Contact</Link>
        <input type="text" placeholder="Search.."></input>
       
       
    </div>
  )
}

export default NavBar