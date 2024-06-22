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
