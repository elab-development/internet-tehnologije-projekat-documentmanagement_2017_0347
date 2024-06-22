import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom'


const MakeDocument = (props) => {

    const {department, id } = useParams();
 
    const documentId = id != null ? id : null;

    const [title, setTitle] = useState('');
    const [date, setDate] = useState('2020-01-01');
    const [preview, setPreview] = useState('');
    const [format, setFormat] = useState('word');
    const [isDocumentCreated, setIsDocumentCreated] = useState(false);
    const location = useLocation();
    
    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }

    useEffect(() => {
        if(id){
            axios.get(`api/documents/${department}/${id}`, {headers: {
                'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`}
            })
            .then(response => {
                console.log('res', response.data);
                const document = response.data.data;
                setTitle(document.title);
                setDate(document.date);
                setFormat(document.format);
                setPreview(document.preview);
            })
            .catch(error => {
                console.log('Error: ', error); });
        }
         
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newDocument = {
                   id: document != null ? document.id : null,// sta se desava sa id u bazi
                    title: title,
                    date: date,
                    text:preview,
                    format: format,
                    department: location.pathname.split('/')[2],
                    employee:  props.userId 
                }
        const route = documentId !==null ? 
        `api/documents/${department}/${document.id}/update`
        :`api/documents/${department}/make`;
        axios.post(route, newDocument,{ headers: {
            'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`}
        })
            .then(response => {
                setIsDocumentCreated(true);
            })
            .catch(error => {
                console.warn('error', error);
            })
    };
    const randomizeDocumentText = () => {
        axios.get('https://baconipsum.com/api/?type=meat-and-filler')
            .then(response=> {
                setPreview(response.data.join('\n'));
            })
    }

    return (
        <div>
            <div className="make-doc-container">
                <form onSubmit={(event) => handleSubmit(event)}>
                    <label htmlFor="title">Title</label>
                    <input className="make-doc-input" value={title} onChange={handleTitleChange} placeholder="Title" />
                    <br />
                    <label htmlFor="date">Date</label>
                    <input className="make-doc-input" value={date} onChange={(event) => setDate(event.target.value)} type="date" />
                    <button type="button" style={{width: '200px'}} onClick={randomizeDocumentText}>Randomize text</button>
                    <textarea className="make-doc-input doc-description"
                        value={preview} onChange={(event) => setPreview(event.target.value)}
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
                            {documentId !== null ? 'Edit' : 'Create'}
                        </button>
                    </div >
                </form>
            </div>
            {
                isDocumentCreated && (<div className='make-edit-doc-success'>
                    <p>Document successfully {documentId !== null ? 'edited' : 'created'}!</p></div>
                )
            }
        </div>
    )
}

export default MakeDocument
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