import React, { useState } from 'react'
import { Link,  useParams } from 'react-router-dom';
import Header from '../Header';
import NavBar from '../NavBar';

const Documents = (props) => {
    const {department} = useParams();
    const [searchParam, setSearchParam] = useState('');
    const [isPdfChecked, setIsPdfChecked] = useState(true);
    const [isWordChecked, setIsWordChecked] = useState(true);
   
    return(
        <div>
            <NavBar/>
             These are the <b>{department}</b> documents: 
            <div>
                {props.isDocumentDeleted && (
                    <div class='deleted-document'>Document successfully deleted!</div>
                )}
            </div>
           
            <div className='container'>
            Search documents:
            <form className="filter-docs">
                <input className='filter-docs-input' type="text"
                    value={searchParam} onChange={(event) => setSearchParam(event.target.value)}
                />
                <input className='filter-docs-input' checked={isPdfChecked} type="checkbox"
                    value="pdf" onChange={() => setIsPdfChecked((current) => !current)}/>pdf
                <input className='filter-docs-input' checked={isWordChecked} type="checkbox"
                    value="word" onChange={() => setIsWordChecked((current) => !current)} /> word
            </form>
            <Link className='create-new-doc' to = { "/documents/" + department + "/make"}><button>Create a document</button></Link>
            </div>
            <div className="all-documents">
                {props.data.filter(document => document.department === department
                 && document.title.includes(searchParam)
                 && (!isPdfChecked ? document.format !== 'pdf' : true)
                 && (!isWordChecked ? document.format !== 'word' : true)
                 ).map(document => (
                    <div className='card'>
                        <b>{document.title}</b>
                        <br />
                        {new Date(document.date).toLocaleDateString()}
                        <br />
                        {document.text.substring(0, 35)}...
                        <br />
                        <Link  className="view-more-button" to={"/document/"+document.department+ "/" + document.id}>
                        <button>View more</button>
                        </Link>
                    </div>
                ))}
            </div>   
           </div>

        
    )
}

export default Documents;