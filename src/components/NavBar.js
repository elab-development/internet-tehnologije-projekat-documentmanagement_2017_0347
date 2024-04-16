import React from 'react'
import { NavLink } from 'react-router-dom'

const NavBar = () =>{
  return (
    <div class="nav-bar">
        <NavLink className="nav-bar-item" to="/">Home</NavLink>
        <NavLink className="nav-bar-item" to="/documents/hr">HR</NavLink>
        <NavLink className="nav-bar-item" to="/documents/it">IT</NavLink>
        <NavLink className="nav-bar-item" to="/documents/marketing">Marketing</NavLink>
        <NavLink className="nav-bar-item" to="/documents/production" >Production</NavLink>
        <NavLink className="nav-bar-item" to="/documents/finance">Finance</NavLink>
        <NavLink className="nav-bar-item" to="/documents/administration">Administration</NavLink>
        <NavLink className="nav-bar-item" to="/contact">Contact</NavLink>
    </div>
  )
}

export default NavBar