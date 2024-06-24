import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DocumentCard = ({ doc, department, deleteDocument }) => {
    const [fileName, setFileName] = useState(doc.title);
    const [previewDoc, setPreviewDoc] = useState(0);
    const [isEditing, setIsRenaming] = useState(false);
    const inputRef = useRef(null);
    const [pdfDoc, setPdfDoc] = useState({});
    // const [base64, setBase64] = useState();
    const navigate = useNavigate();
    //console.log('inputRef', inputRef);

    const handleEdit = (event) => {

    }

    // const handleDownload = async () => {
    //     try{
    //         const response = await axios.get(`api/documents/${department}/download/${doc.id}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`
    //             },
    //             responseType: 'blob'
    //         })
    
    //         // Create a URL for the blob
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    
    //         // Create a link element
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', document.title); // or any other filename you want to give to the downloaded file
    
    //         // Append the link to the body
    //         document.body.appendChild(link);
    
    //         // Programmatically click the link to trigger the download
    //         link.click();
    
    //         // Clean up and remove the link
    //         link.parentNode.removeChild(link);

    //     } catch (error) {
    //         console.error('Download error:', error);
    //     }
    // }
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

    // const handlePreview = () => {
    //     if (base64) {
    //         var newWindow = window.open();
    //         newWindow.document.title = pdfDoc.title;
    //         newWindow.document.write(`
    //             <html>
    //             <head>
    //                 <title>${pdfDoc.title}</title>
    //             </head>
    //             <body style="margin:0;">
    //                 <embed width="100%" height="100%" src="${base64}" type="application/pdf"></embed>
    //             </body>
    //             </html>
    //         `);
    //         newWindow.document.close();
    //     }else {
    //         console.error('Base64 data is not available');
    //     }
    // }

    // useEffect(() => {
      //  const fetchDocument = async () => {
            // try {
            //     const response = axios.get(`api/documents/${department}/${document.id}`, {
            //         headers: {
            //             'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`
            //         }
            //     }).then(()=>{
            //         setPdfDoc(response.data.data);

            //         const pathResponse = axios.get(`api/documents/path/${response.data.data.title}/${response.data.data.format}`, {
            //             headers: {
            //                 'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`
            //             }
            //         }).then(()=>{
            //             setBase64(pathResponse.data.base64);
            //         })
            //     });                
            // } catch (error) {
            //     console.error('Error fetching document:', error);
            // }
        //};

        //Da li je sad u ovome stvar fetchDocument();
       //await fetchDocument();
    // }, [previewDoc]);  
    //}, [department,document.id]);
    //chat kaze department i document.id
//}, [previewDoc]);

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
                    <input ref={inputRef} value={fileName} onChange={(event) => setFileName(event.target.value)} disabled={!isEditing}/>
                    <div className={isEditing ? '' : 'invisible'}>
                        {isEditing && (
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
        setIsRenaming(isEditingOld => !isEditingOld);
        if (inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus(); 
            });
        }
    }

    return (
        <div className='card' key={doc.id}>
            {renderTitle()}
            {/* {new Date(document.date).toLocaleDateString()} */}
            {/* <b>{doc+ument.preview}</b> */}
            <div>
                <button onClick={toggleIsRenaming}>Rename</button>
                 
                
                {/* <a href={`http://localhost:8000/${doc.path}`}>
                    <button>Download 1</button>
                </a>  */}
                {doc.format == 'word' && (                    
                    <Link className="regular" to={"/document/" + department + "/" + doc.id} state={doc}>
                        <button>Excerpt</button>
                    </Link>
                )}
                {doc.format == 'pdf' && (
                    <button onClick={handlePreview}>Preview </button>
                )}

                 {/* <button onClick={handleDownload}>Download2</button>  */}
                 <button onClick={handleDownload}>Download</button>
                <button className="disabled-button" onClick={handleEdit}>Edit</button>
                <button className="delete-button" onClick={handleDelete}>Delete</button>

            </div>
        </div>
    )
}

export default DocumentCard
// {document.preview.substring(0, 35)}...
//prethodna verzija
        // useEffect(() => {
        //     axios.get(`api/documents/${department}/${document.id}`, {
        //         headers: {
        //             'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`
        //         }
        //     })
        //         .then(response => {
        //             console.log('res', response.data);
        //             setPdfDoc(response.data.data);
    
        //             axios.get(`api/documents/path/${response.data.data.title}/${response.data.data.format}`, {
        //                 headers: {
        //                     'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`
        //                 }
        //             })
        //                 .then(pathResponse => {
        //                     console.log('pathLog', pathResponse.data);
        //                     setBase64(pathResponse.data.base64);
        //                 })
        //                 .catch(error => {
        //                     console.log('PathError: ', error);
        //                 });
    
    
        //             // const pathToFile = 'C:/xampp/htdocs/trenutni/internet-tehnologije-projekat-documentmanagement_2017_0347/public/storage/';
        //             // setPath(pathToFile + response.data.data.title + `.${response.data.data.format}`);
        //         })
        //         .catch(error => {
        //             console.log('Error: ', error);
        //         });
    
        //     axios.get(`api/documents/${department}/${document.id}`, {
        //         headers: {
        //             'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`
        //         }
        //     })
        //         .then(response => {
        //             console.log('res', response.data);
        //             setPdfDoc(response.data.data);
    
        //             // const pathToFile = 'C:/xampp/htdocs/trenutni/internet-tehnologije-projekat-documentmanagement_2017_0347/public/storage/';
        //             // setPath(pathToFile + response.data.data.title + `.${response.data.data.format}`);
        //         })
        //         .catch(error => {
        //             console.log('Error: ', error);
        //         });
        // }, [previewDoc]);