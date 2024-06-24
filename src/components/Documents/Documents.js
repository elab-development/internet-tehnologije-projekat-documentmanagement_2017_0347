import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import DocumentCard from './DocumentCard';
import TagBar from "./TagBar";
import AuthorBar from './AuthorsBar';
import Paginate from '../Pagination';

const Documents = (props) => {
    const { department } = useParams();
    const [isDocumentDeleted, setIsDocumentDeleted] = useState(false);
    // const [currentDepartment, setCurrentDepartment] = useState(department);

    const [searchParam, setSearchParam] = useState('');
    const [isPdfChecked, setIsPdfChecked] = useState(true);
    const [isWordChecked, setIsWordChecked] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [docsPerPage] = useState(4);
    const indexOfLastDoc = currentPage * docsPerPage;
    const indexOfFirstDoc = indexOfLastDoc - docsPerPage;
    const [departmentDocs, setDepartmentDocs] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [error, setError] = useState('');
    const [allDocuTags, setAllDocuTags] = useState([]);

    const [selectedTag, setSelectedTag] = useState('all');
    const [selectedAuthor, setSelectedAuthor] = useState('all');
    // const currentDocs = departmentDocs.slice(indexOfFirstDoc, indexOfLastDoc);

    // axios.get(`documents/${department}`)
    //     .then(response => {
    //         setDepartmentDocs(response.data);
    //     })

    useEffect(() => {
        axios.get('api/docuTags').then((res) => {
            setAllDocuTags(res.data);
        });
    }, []);

    const filterDocumentsByTag = (selectedTag) => {
        setSelectedTag(selectedTag);
    }

    const filterDocumentsByAuthor = (selectedAuthor) => {
        setSelectedAuthor(selectedAuthor);
    }

    useEffect(() => {
        axios.get(`api/documents/${department}`, {
            headers: {
                'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`
            }
        })
        .then(response => {
            setDepartmentDocs(response.data.data);
        })
        .catch(error => {
            console.log('error', error);
            setError('Only authorized users can view this content.');
        });
    }, [department]);

    useEffect(() => {
        setFilteredDocuments(departmentDocs);
    }, [departmentDocs]);

    useEffect(() => {
        let docsToShow = departmentDocs;

        if (selectedTag !== "all") {
            const documentIds = allDocuTags.filter(docTag => docTag.tag_id == selectedTag).map(el => el.document_id);
            docsToShow = departmentDocs.filter(depDoc => documentIds.includes(depDoc.id));
        }

        if (selectedAuthor !== "all") {
            docsToShow = docsToShow.filter(filDoc => filDoc.employee_fk == selectedAuthor);
        }

        if (searchParam) {
            docsToShow = docsToShow.filter(document => document.title.toLowerCase().includes(searchParam.toLowerCase()));
        }

        setFilteredDocuments(docsToShow);
    }, [selectedTag, selectedAuthor, searchParam, departmentDocs, allDocuTags]);

    const deleteDocument = async (documentId, department) => {
        try {
            var res = await axios.delete(`api/documents/${department}/${documentId}/${props.userId}/delete`, {
                headers: {
                    'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`
                }
            });

            if (res) {
                setIsDocumentDeleted(true);
                setDepartmentDocs(departmentDocs.filter(doc => doc.id !== documentId));
            }
        } catch (err) { 
            throw err;
        }
    }

    useEffect(() => {
        if (isDocumentDeleted) {
            setTimeout(() => { setIsDocumentDeleted(false); }, 5000);
        }
    }, [isDocumentDeleted]);

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
                {isDocumentDeleted && (
                    <div className='deleted-document'>Document successfully deleted!</div>
                )}
            </div>

            <div className='container'>
                Search documents:
                <form className="filter-docs">
                    <input 
                        className='filter-docs-input' 
                        type="text"
                        value={searchParam} 
                        onChange={(event) => setSearchParam(event.target.value)}
                        placeholder="Search by title"
                    />
                    {/* <input className='filter-docs-input' checked={isPdfChecked} type="checkbox"
                        value="pdf" onChange={pdfCheckboxChange} />pdf
                    <input className='filter-docs-input' checked={isWordChecked} type="checkbox"
                        value="word" onChange={wordCheckboxChange} /> word */}
                </form>
                <TagBar filterDocs={filterDocumentsByTag} />
                <AuthorBar 
                    employees={props.employees} 
                    departmentId={props.departments.find(d => d.name === department).id} 
                    filterDocumentsByAuthor={filterDocumentsByAuthor} 
                />
                <Link className='create-new-doc' to={`/documents/${department}/upload2`}><button>Upload a document</button></Link>
                <Link className='create-new-doc' to={`/documents/${department}/make`}><button>Create a document</button></Link>
            </div>
            
            {error && (<div>{error}</div>)}

            <div className="all-documents">
                {filteredDocuments.map(document => (
                    <DocumentCard key={document.id} doc={document} department={department} deleteDocument={deleteDocument} />
                ))}
            </div>
            
            {/* <Paginate
                docsPerPage={docsPerPage}
                totalDocs={filteredDocuments.length}
                paginate={paginate}
                previousPage={previousPage}
                nextPage={nextPage}
            /> */}
        </div>
    );
}

export default Documents;
