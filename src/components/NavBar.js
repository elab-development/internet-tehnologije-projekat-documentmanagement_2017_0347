import { NavLink } from 'react-router-dom'

const NavBar = ({departments}) =>{
  return (
    <div className="nav-bar">
        <NavLink className="nav-bar-item" to="/">Home</NavLink>
        {departments.map(element => 
        <NavLink className="nav-bar-item" key={element.id} value={element.id} to={`/documents/${element.name}`  }>
          {(element.name == 'hr' || element.name=='it')? element.name.toUpperCase():
           element.name.charAt(0).toUpperCase()+ element.name.slice(1) }</NavLink>)}
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