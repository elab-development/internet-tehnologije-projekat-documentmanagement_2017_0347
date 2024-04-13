import React from 'react'
import { Link,  useParams } from 'react-router-dom';
import Header from '../Header';
import NavBar from '../NavBar';
// {"/documents/" + department + "/"+ document.id}
const Documents = (props) => {
    const {department} = useParams();
    return(
    
        <div>
            <NavBar/>
            These are the <b>{department}</b> documents:
            <div className="all-documents">
                {props.data.filter(document => document.department === department).map(document => (
                    <div className='card'>
                        {document.title}
                        <br />
                        {document.date}
                        <br />
                        {document.text.substring(0, 30)}...
                        <br />
                        <Link to={"/document/"+document.department+ "/" + document.id}>
                        <button>View more</button>
                        </Link>
                    </div>
                ))}
            </div>
           <Link to = { "/documents/" + department + "/make"}><button>Create a document</button></Link>   
           </div>

        
    )
}

export default Documents;