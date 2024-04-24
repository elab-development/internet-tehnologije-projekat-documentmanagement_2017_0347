import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom/dist";
const Header = () => {
    const navigate = useNavigate();

    const handleLogout = (e) => {
        axios.post('/api/logout', null, {
            headers: {
                'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`
            }
        }).then(res => {
            window.sessionStorage.removeItem("auth_token");
            navigate('/login');
        }).catch(er => console.log('er', er))
    }
    return (
        <div className="header">
            <img className="my-logo" src={require('../resource/mylogo.jpg')} />
            {window.sessionStorage.getItem("auth_token") == null ?
                <Link className="login" to='/login'> Login/Register </Link> :
                <Link className="login" onClick={handleLogout}> Logout </Link>
            }
        </div>
    )
}
export default Header;