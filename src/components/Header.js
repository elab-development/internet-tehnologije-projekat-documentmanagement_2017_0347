import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className="header">
            <img  className="my-logo" src={require('../resource/mylogo.jpg')}  />
            <Link className="login" to='/login'>Login\Register</Link>
        </div>
    )
}
export default Header;