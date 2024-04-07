import { useParams, Link} from 'react-router-dom';

const OneDocument = (props) => {
    const { id } = useParams();
    
    console.log('id', id);
    console.log(props);

    const document = props.dataDocs.find(element => element.id == id)
    const employee = props.dataEmp.find(element => element.id == document.employee)
    console.log('document', document)
    console.log('employees', employee)
    return (
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
            <Link to = {"/documents/:department/make/" + id}>
            <button className="btn-edit">Edit document</button>
            </Link>
            <br />
            <button className="btn-delete">Delete document</button>
        </div>
    )

}

export default OneDocument;
