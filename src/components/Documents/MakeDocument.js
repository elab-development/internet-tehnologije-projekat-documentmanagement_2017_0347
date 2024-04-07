import React from 'react'
import {useState} from 'react';
import NavBar from '../NavBar';
import {useLocation, useParams} from 'react-router-dom'

const MakeDocument = (props) => {
    
    const {id} = useParams();
    const document = id !== null ? props.data.find(doc => doc.id == id) : null; 
    const [title, setTitle] = useState(document ? document.title : '');
    const [date, setDate] = useState(document ? document.date : '2020-01-01');
    const [text, setText] = useState(document ? document.text : '');
    const [format, setFormat] = useState(document ? document.format : '');
    const[isDocumentCreated, setIsDocumentCreated]= useState(false);
    const location = useLocation();
    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDeault();
        const newDocument={
            title: title,
            date: date, 
            text: text ,
            format : format,
            department : location.pathname.splits('/')[2],
            employee: props.userId
        }

       props.addDocument(newDocument);
        setIsDocumentCreated(true);
    }

 
  return (
    <div>
        <NavBar/> 
            Make document:
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input value={title} onChange={handleTitleChange} placeholder="Title" />
                <label htmlFor="date">Date</label>
                <input value={date} onChange={(event) => setDate(event.target.value)} type="date" />
                <textarea 
                    value={text} 
                    onChange={(event) => setText(event.target.value)}
                    rows={10}
                ></textarea>
                <input
                    type="radio"
                    name="format"
                    value="word"
                    onChange={(event) => setFormat(event.target.value)}
                    checked={format === 'word'}
                />Word
                <input
                    type="radio"
                    name="format"
                    value="pdf"
                    onChange={(event) => setFormat(event.target.value)}
                    checked={format === 'pdf'}
                />Pdf
                <button type="submit">Make/Edit</button>
            </form>
            {
                isDocumentCreated && (<div>
                    Document successfully created!</div>
                )
            }
        </div>
  )
}

export default MakeDocument