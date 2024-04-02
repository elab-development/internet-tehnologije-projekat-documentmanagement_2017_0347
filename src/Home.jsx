import  Header  from "./components/Header";
import NavBar from "./components/NavBar";


export const Home = () => {
    return(
        <div>
           <Header/>
           <NavBar/>  
            <h1>Welcome</h1>
            <p>Welcome to the Document Management System of XYZ! To use this system, make sure to
                first make an account, then log in.
            </p>
              
        </div>
    )
}