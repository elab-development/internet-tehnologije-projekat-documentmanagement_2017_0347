import { useParams,useNavigate, Link} from 'react-router-dom';
import NavBar from '../NavBar';

const OneDocument = (props) => {
    const { id,department } = useParams();
    const navigate= useNavigate();
    
    const document = props.dataDocs.find(element => element.id == id)
    const employee = props.dataEmp.find(element => element.id == document.employee)
    const handleDelete = () => {
        props.deleteDocument(id);
        navigate('/documents/' + department);
    }
  
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
            <button className="btn-delete" onClick={handleDelete}>Delete document</button>
        </div>
        </>
    )

}

export default OneDocument;
