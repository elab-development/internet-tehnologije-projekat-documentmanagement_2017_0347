import { useLocation } from 'react-router-dom';

const OneDocument = (props) => {
   
    const location = useLocation();
    const doc = location.state || {};

    return (
        <div className='container'>
            <span className='title'><b>{doc.title}</b></span>
            <span className='badge'>{doc.format}</span>
            <br />
            <span className='document-date'>
                {new Date(doc.date).toLocaleDateString()}
            </span>
            <p>{doc.preview}</p>
            <br />
            <br />
        

        </div>
    )
}
export default OneDocument;
