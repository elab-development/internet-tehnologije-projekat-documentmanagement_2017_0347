import { Link } from "react-router-dom"

export const Home = () => {
    return(
        <div>
            <Link className="login" to='/login'>Login\Register</Link>
            <h1>Welcome</h1>
            <p>Welcome to the Document Management System of XYZ! To use this system, make sure to
                first make an account, then log in.
            </p>    
        </div>
    )
}