import { useParams, Link} from 'react-router-dom';
import NavBar from '../NavBar';

const OneDocument = (props) => {
    const { id } = useParams();
    
    const document = props.dataDocs.find(element => element.id == id)
    const employee = props.dataEmp.find(element => element.id == document.employee)
  
    return (
        <> 
        <NavBar/>
        <div>
            <h1>{document.title}</h1>
            <br />
            <p>{document.text}</p>
            <br />
            <p>{document.date}</p>
            <br />
            <p>{document.format}</p>
            <br />
            <p>{employee.name}</p>
            <br />
            <Link to = {"/documents/"+document.department + "/make/" + id}>
            <button className="btn-edit">Edit document</button>
            </Link>
            <br />
            <button className="btn-delete">Delete document</button>
        </div>
        </>
    )

}

export default OneDocument;
