import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const OneDocument = (props) => {
    const { department, id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState({});

    const handleDelete = () => {
        props.deleteDocument(id, department).then(() => {
            navigate('/documents/' + department);
        }).catch(() => { });
    }

    useEffect(() => {
        axios.get(`api/documents/${department}/${id}`, {
            headers: {
                'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`
            }
        })
            .then(response => {
                console.log('res', response.data);
                setDocument(response.data.data);
            })
            .catch(error => {
                console.log('Error: ', error);
            });
    }, [id]);

    return (
        <div className='container'>
            <span className='title'><b>{document.title}</b></span>
            <span className='badge'>{document.format}</span>
            <br />
            <span className='document-date'>
                {new Date(document.date).toLocaleDateString()}
            </span>
            <br />
            {/* <p>Created by <b>{employee.name}</b></p> */}
            <p>{document.preview}</p>
            <br />
            <br />
            <div className="change-buttons">
                <Link to={"/documents/" + department + "/make/" + id}>
                    <button >Edit document</button>
                </Link>
                <button className="delete-button" onClick={handleDelete}>Delete document</button>
            </div>
        </div>
    )
}
export default OneDocument;
