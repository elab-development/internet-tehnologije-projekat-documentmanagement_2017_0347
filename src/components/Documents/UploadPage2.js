import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UploadPage2 = (props) => {
  const { department } = useParams();
  const [file, setFile] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const dropZoneRef = useRef(null);

  const handleUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropZoneRef.current.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dropZoneRef.current.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dropZoneRef.current.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setIsError(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", props.userId);
    const route = `api/documents/${department}/upload`;
    axios.post(route, formData, {
      headers: {
        'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`,
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        console.log('success', response)
        setIsFileUploaded(true);
      })
      .catch(error => {
        setIsError(true);
        console.warn('error', error);
      });
  };

  return (
    <div className='upload-page'>
      <h2>Upload your file here:</h2>
      <div
        ref={dropZoneRef}
        className='drop-zone'
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => dropZoneRef.current.querySelector('input').click()}
      >
        Drag and drop your file here, or click to select a file
        <input
          type="file"
          className="file-input"
          onChange={handleUpload}
          style={{ display: 'none' }}
          accept='.pdf, .doc, .docx'
        />
      </div>
      {file && (
        <div className='file-container'>
          {file.name}
          <span className="remove-file" onClick={() => { setFile(null) }}>x</span>
        </div>
      )}
      <button onClick={handleSubmit}>Upload</button>
      {isFileUploaded && <div className="success-message">Document uploaded successfully!</div>}
      {isError && <div className="error-message">Error occured, please try again later!</div>}
    </div>
  );
};

export default UploadPage2;
