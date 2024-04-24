import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom'


const MakeDocument = (props) => {

    const {department, id } = useParams();
 
    const document = id !== undefined ? id : null;

    const [title, setTitle] = useState(document ? document.title : '');
    const [date, setDate] = useState(document ? document.date : '2020-01-01');
    const [text, setText] = useState(document ? document.text : '');
    const [format, setFormat] = useState(document ? document.format : '');
    const [isDocumentCreated, setIsDocumentCreated] = useState(false);
    const location = useLocation();
    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newDocument = {
                    id: document !== null ? document.id : null,// sta se desava sa id u bazi
                    title: title,
                    date: date,
                    text: text,
                    format: format,
                    department: location.pathname.split('/')[2],
                    employee:  props.userId 
                }
        const route = document !== null ? 
                `api/documents/${department}/make`
                : `api/documents/${department}/${document.id}/update`;
        axios.post(route, newDocument)
            .then(response => {
                setIsDocumentCreated(true);
            })
            .catch(error => {
                console.warn('error', error);
            })
    };
    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     const newDocument = {
    //         id: document !== null ? document.id : null,
    //         title: title,
    //         date: date,
    //         text: text,
    //         format: format,
    //         department: location.pathname.split('/')[2],
    //         employee: 1
    //         // employee: props.userId mehanizam za usera u "bazi"
    //     }

    //     props.addDocument(newDocument);
    //     setIsDocumentCreated(true);
    // }


    return (
        <div>
            <div className="make-doc-container">
                <form onSubmit={(event) => handleSubmit(event)}>
                    <label htmlFor="title">Title</label>
                    <input className="make-doc-input" value={title} onChange={handleTitleChange} placeholder="Title" />
                    <br />
                    <label htmlFor="date">Date</label>
                    <input className="make-doc-input" value={date} onChange={(event) => setDate(event.target.value)} type="date" />
                    <textarea className="make-doc-input doc-description"
                        value={text} onChange={(event) => setText(event.target.value)}
                        rows={20} resize="none"
                    ></textarea>
                    <br />
                    <input className="radio-input"
                        type="radio" name="format" value="word"
                        onChange={(event) => setFormat(event.target.value)}
                        checked={format === 'word'}
                    />word
                    <input className="radio-input"
                        type="radio" name="format" value="pdf"
                        onChange={(event) => setFormat(event.target.value)}
                        checked={format === 'pdf'}
                    />pdf
                    <br />
                    <div className='submit-make-doc'>
                        <button type="submit">
                            {document !== null ? 'Edit' : 'Create'}
                        </button>
                    </div >
                </form>
            </div>
            {
                isDocumentCreated && (<div className='make-edit-doc-success'>
                    <p>Document successfully {document !== null ? 'edited' : 'created'}!</p></div>
                )
            }
        </div>
    )
}

export default MakeDocument