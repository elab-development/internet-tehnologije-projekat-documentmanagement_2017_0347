import React from 'react';

const Paginate = ({ docsPerPage, totalDocs, paginate, previousPage, nextPage, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalDocs / docsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination-container">
            <ul className="pagination">
                <li onClick={previousPage} className="page-number">
                    Prev
                </li>
                {pageNumbers.map((number) => (
                    <li
                        key={number}
                        onClick={() => paginate(number)}
                        className={`page-number ${currentPage === number ? 'active' : ''}`}
                    >
                        {number}
                    </li>
                ))}
                <li onClick={nextPage} className="page-number">
                    Next
                </li>
            </ul>
        </div>
    );
};

export default Paginate;