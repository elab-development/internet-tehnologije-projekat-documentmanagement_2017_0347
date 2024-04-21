import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import Paginate from '../Pagination';

const Documents = (props) => {
    const { department } = useParams();
    const [searchParam, setSearchParam] = useState('');
    const [isPdfChecked, setIsPdfChecked] = useState(true);
    const [isWordChecked, setIsWordChecked] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(3);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const departmentPosts = props.data.filter(post => post.department === department);
    const [filteredDepartments, setFilteredDepartments] = useState(departmentPosts);
    const currentPosts = filteredDepartments.slice(indexOfFirstPost, indexOfLastPost)

    const previousPage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage !== Math.ceil(filteredDepartments.length / postsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const paginate = (selected) => {
        setCurrentPage(selected);
    };

    function pdfCheckboxChange(e) {
        setIsPdfChecked((current) => !current);
        if (e.target.checked) {
            setFilteredDepartments(filteredDepartments.concat(departmentPosts.filter(document => document.format === 'pdf')));
        } else {
            setFilteredDepartments(filteredDepartments.filter(document => document.format !== 'pdf'))
        }
    }

    function wordCheckboxChange(e) {
        setIsWordChecked((current) => !current)
        if (e.target.checked) {
            setFilteredDepartments(filteredDepartments.concat(departmentPosts.filter(document => document.format === 'word')));
        } else {
            setFilteredDepartments(filteredDepartments.filter(document => document.format !== 'word'))
        }
    }

    return (
        <div>
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
                        value="pdf" onChange={pdfCheckboxChange} />pdf
                    <input className='filter-docs-input' checked={isWordChecked} type="checkbox"
                        value="word" onChange={wordCheckboxChange} /> word
                </form>
                <Link className='create-new-doc' to={"/documents/" + department + "/make"}><button>Create a document</button></Link>
            </div>
            <div className="all-documents">
                {currentPosts.filter(document => document.department === department
                        && (document.title.toLowerCase().includes(searchParam.toLowerCase() )
                        || document.text.toLowerCase().includes(searchParam.toLowerCase() ))
                    ).map(document => (
                            
                        <div className='card'>
                            <b>{document.title}</b>
                            <br />
                            {new Date(document.date).toLocaleDateString()}
                            <br />
                            {document.text.substring(0, 35)}...
                            <Link className="regular"to={"/document/" + document.department + "/" + document.id}>
                                View more
                            </Link>
                        </div>
                   )) }
            </div>
            <Paginate
                postsPerPage={postsPerPage}
                totalPosts={filteredDepartments.length}
                paginate={paginate}
                previousPage={previousPage}
                nextPage={nextPage}
            />
        </div>


    )
}

export default Documents;