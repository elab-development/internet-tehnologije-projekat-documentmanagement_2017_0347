import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () =>{
  return (
    <div>
         <Link className="nav-bar-item" to="/">Home</Link>
        <Link className="nav-bar-item" to="/documents/hr">HR</Link>
        <Link className="nav-bar-item" to="/documents/it">IT</Link>
        <Link className="nav-bar-item" to="/documents/marketing">Marketing</Link>
        <Link className="nav-bar-item" to="/documents/production" >Production</Link>
        <Link className="nav-bar-item" to="/documents/finance">Finance</Link>
        <Link className="nav-bar-item" to="/documents/administration">Administration</Link>
        <Link className="nav-bar-item" to="/contact">Contact</Link>
    </div>
  )
}

export default NavBar