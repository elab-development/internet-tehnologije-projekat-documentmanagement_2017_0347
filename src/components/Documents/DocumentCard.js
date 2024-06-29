import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DocumentCard = ({ doc, department, deleteDocument }) => {
    const [fileName, setFileName] = useState(doc.title);
    
    const [isRenaming, setIsRenaming] = useState(false);
    const inputRef = useRef(null);
   
    const navigate = useNavigate();
  
    const handleDownload = async () => {
        try{
            // const pathWithBackSlash=document.path.replace(/\//g, '\\');
            const encodedFilePath = encodeURIComponent(doc.path);

            const response = await axios.get(`api/documents/download/?filePath=${encodedFilePath}`, {
                headers: {
                    'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`
                },
                responseType: 'blob'
            })
    
            // Create a URL for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
    
            // Get document title
            var lastIndex = doc.path.lastIndexOf('\\');
            var filename = doc.path.substring(lastIndex + 1);

            // Create a link element
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename); // or any other filename you want to give to the downloaded file
    
            // Append the link to the body
            document.body.appendChild(link);
    
            // Programmatically click the link to trigger the download
            link.click();
    
            // Clean up and remove the link
            link.parentNode.removeChild(link);

        } catch (error) {
            console.error('Download error:', error);
        }
    }


    const handlePreview = async () => {
       
        const pathResponse = await axios.get(`api/documents/path/${doc.title}/${doc.format}`, {
            headers: {
                'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`
            }
        })
        const base64=pathResponse.data.base64;

        var newWindow = window.open();
        newWindow.document.title = doc.title;
        newWindow.document.write(`
            <html>
            <head>
                <title>${doc.title}</title>
            </head>
            <body style="margin:0;">
                <embed width="100%" height="100%" src="${base64}" type="application/pdf"></embed>
            </body>
            </html>
        `);
        newWindow.document.close();
    }

    const handleDelete = async () => {
        try {
            await deleteDocument(doc.id, department);
            navigate(`/documents/${department}`);
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const renameDocument = async () => {
        try {
            await axios.put(`api/documents/${department}/${doc.id}/rename`, {
                title: fileName,
                path: fileName + doc.path.split('.')[1]
            }, {
                headers: {
                    'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`
                }
            });

            setIsRenaming(false);
            console.log('Document renamed successfully');
        } catch (error) {
            console.error('Rename error:', error);
        }
    };

    const renderTitle = () => {
        return (
            <>
                <div>
                    <input ref={inputRef} value={fileName} onChange={(event) => setFileName(event.target.value)} disabled={!isRenaming}/>
                    <div className={isRenaming ? '' : 'invisible'}>
                        {isRenaming && (
                            <>
                                <button onClick={() => { setIsRenaming(false) }}>Cancel</button>
                                <button onClick={renameDocument}>Save</button>
                            </>
                        )}                        
                    </div>
                </div>
            </>
        )
    }

    const toggleIsRenaming = () => {
        setIsRenaming(isRenamingOld => !isRenamingOld);
        if (inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus(); 
            });
        }
    }
    const handleEdit =  () => {
        
    };
    return (
        <div className='card' key={doc.id}>
            {renderTitle()}
           
            <div>
                <button onClick={toggleIsRenaming}>Rename</button>
                 
              
                {doc.format == 'word' && (                    
                    <Link className="regular" to={"/document/" + department + "/" + doc.id} state={doc}>
                        <button>Excerpt</button>
                    </Link>
                )}
                {doc.format == 'pdf' && (
                    <button onClick={handlePreview}>Preview </button>
                )}

                
                 <button onClick={handleDownload}>Download</button>
                <button className="disabled-button" onClick={handleEdit}>Edit</button>
                <button className="delete-button" onClick={handleDelete}>Delete</button>

            </div>
        </div>
    )
}

export default DocumentCard
