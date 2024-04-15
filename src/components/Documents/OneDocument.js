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
        <br/>
        <div className='container'>
            <span className='title'><b>{document.title}</b></span>
            <span className='badge'>{document.format}</span>
            <br />
            <span className='document-date'>
             {new Date(document.date).toLocaleDateString()}
            </span>
            <br/>
            <p>Created by <b>{employee.name}</b></p>
            <p>{document.text}</p>
            <br />
            <br/>
            <div className="change-buttons">
            <Link to = {"/documents/"+document.department + "/make/" + id}>
            <button >Edit document</button>
            </Link>
            <button className="delete-button" onClick={handleDelete}>Delete document</button>
            </div>
        </div>
        </>
    )

}

export default OneDocument;
