import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import Paginate from '../Pagination';
import axios from 'axios';

const Documents = (props) => {
    const { department } = useParams();
    //const[currentDepartment,setCurrentDepartment]=useState(department);

    const [searchParam, setSearchParam] = useState('');
    const [isPdfChecked, setIsPdfChecked] = useState(true);
    const [isWordChecked, setIsWordChecked] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [docsPerPage] = useState(4);
    const indexOfLastDoc = currentPage * docsPerPage;
    const indexOfFirstDoc = indexOfLastDoc - docsPerPage;
    const [departmentDocs, setDepartmentDocs] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState(departmentDocs);
    const [error, setError] =  useState('');
    // const currentDocs = departmentDocs.slice(indexOfFirstDoc, indexOfLastDoc);

    // axios.get(`documents/${department}`)
    //     .then(response => {
    //         setDepartmentDocs(response.data);
    //     })

    useEffect(() => { 
        axios.get(`api/documents/${department}`,
            { headers: {
                    'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`}
            })
            .then(response => {
                setDepartmentDocs(response.data.data);
            })
            .catch(error => {
                console.log('error', error);
                setError('Only authorized users can view this content.')
            })
    }, [department]);


    // const previousPage = () => {
    //     if (currentPage !== 1) {
    //         setCurrentPage(currentPage - 1);
    //     }
    // };

    // const nextPage = () => {
    //     if (currentPage !== Math.ceil(filteredDocuments.length / docsPerPage)) {
    //         setCurrentPage(currentPage + 1);
    //     }
    // };

    // const paginate = (selected) => {
    //     setCurrentPage(selected);
    // };

    // function pdfCheckboxChange(e) {
    //     setIsPdfChecked((current) => !current);
    //     if (e.target.checked) {
    //         setFilteredDocuments(filteredDocuments.concat(departmentDocs.filter(document => document.format === 'pdf')));
    //     } else {
    //         setFilteredDocuments(filteredDocuments.filter(document => document.format !== 'pdf'))
    //     }
    // }

    // function wordCheckboxChange(e) {
    //     setIsWordChecked((current) => !current)
    //     if (e.target.checked) {
    //         setFilteredDocuments(departmentDocs.concat(departmentDocs.filter(document => document.format === 'word')));
    //     } else {
    //         setFilteredDocuments(filteredDocuments.filter(document => document.format !== 'word'))
    //     }
    // }
    return (
        <div>
            <div>
                {props.isDocumentDeleted && (
                    <div className='deleted-document'>Document successfully deleted!</div>
                )}
            </div>

            <div className='container'>
                Search documents:
                <form className="filter-docs">
                    <input className='filter-docs-input' type="text"
                        value={searchParam} onChange={(event) => setSearchParam(event.target.value)}
                    />
                    {/* <input className='filter-docs-input' checked={isPdfChecked} type="checkbox"
                        value="pdf" onChange={pdfCheckboxChange} />pdf
                    <input className='filter-docs-input' checked={isWordChecked} type="checkbox"
                        value="word" onChange={wordCheckboxChange} /> word */}
                </form>
                <Link className='create-new-doc' to={"/documents/" + department + "/make"}><button>Create a document</button></Link>
            </div>
            {error && (<div>{error}</div>)}
            <div>lalal</div>
            {
                    <div className="all-documents">
                        {departmentDocs.filter(document => document.title.toLowerCase().includes(searchParam.toLowerCase())
                            || document.preview.toLowerCase().includes(searchParam.toLowerCase())
                        ).map(document => (

                            <div className='card'key={document.id}>
                                <b>{document.title}</b>
                                <br />
                                {new Date(document.date).toLocaleDateString()}
                                <br />
                                {document.preview.substring(0, 35)}...
                                <Link className="regular" to={"/document/" + department + "/" + document.id}>
                                    View more
                                </Link>
                            </div>
                        ))}
                    </div>     
            }
            {/* <Paginate
                docsPerPage={docsPerPage}
                totalDocs={filteredDocuments.length}
                paginate={paginate}
                previousPage={previousPage}
                nextPage={nextPage}
            /> */}
        </div>
    )
}
export default Documents;
// {currentDocs.filter(document => document.department === department
//     && (document.title.toLowerCase().includes(searchParam.toLowerCase() )
//     || document.text.toLowerCase().includes(searchParam.toLowerCase() ))