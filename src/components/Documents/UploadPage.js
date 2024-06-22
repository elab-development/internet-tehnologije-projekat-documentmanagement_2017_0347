import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UploadPage = () => {
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
    const route = `api/documents/${department}/upload`;
    axios.post(route, formData, {
      headers: {
        'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`
      }
    })
    .then(response => {
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
        <input
          type="file"
          onChange={handleUpload}
        />
      <button onClick={handleSubmit}>Upload</button>
      {isFileUploaded && <div>Worked!</div>}
      {isError && <div>Nope!</div>}
    </div>
  );
};

export default UploadPage;
