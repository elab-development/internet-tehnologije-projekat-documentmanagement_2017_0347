import React, { useEffect, useState } from 'react';

function AuthorBar(props) {
    const [authors, setAuthors] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState("all");

    useEffect(() => {
        loadAuthors();
    }, []);

    const loadAuthors = async () => {
        setAuthors(props.employees.filter(employee => employee.department_fk == props.departmentId || employee.role === 'admin'));
    }

    const handleAuthorChange = (event) => {
        setSelectedAuthor(event.target.value);
        props.filterDocumentsByAuthor(event.target.value);
    };

    return (
        <div className='author-container'>
            <p className='author-search'>Search by author:</p>
            <select value={selectedAuthor} onChange={handleAuthorChange}>
                <option value="all">all</option>
                {authors.map(author => (
                    <option key={author.id} value={author.id}>{author.name}</option>
                ))}
            </select>
        </div>
    );
}

export default AuthorBar;
