import React from 'react'
import {useState} from 'react';

const MakeDocument = () => {
    
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('2020-01-01');
    const [text, setText] = useState('');
    const [format, setFormat] = useState('');

    const handleSubmit = () => {

    }

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }
  return (
    <div>
            Make/Edit document:
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
        </div>
  )
}

export default MakeDocument