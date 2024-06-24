import { useLocation } from 'react-router-dom';

const OneDocument = (props) => {
   
    const location = useLocation();
    const doc = location.state || {};

    return (
        <div className='container'>
            <span className='title'><b>{doc.title}</b></span>
            <span className='badge'>{doc.format}</span>
            <br />
            <span className='document-date'>
                {new Date(doc.date).toLocaleDateString()}
            </span>
            <p>{doc.preview}</p>
            <br />
            <br />
            {/* <p>Created by <b>{employee.name}</b></p> */}
            <br />
            {/* <div className="change-buttons">
                <Link to={"/documents/" + department + "/make/" + id}>
                    <button >Edit document</button>
                </Link>
                <button className="delete-button" onClick={handleDelete}>Delete document</button>  </div> */}

        </div>
    )
}
export default OneDocument;
// const [document, setDocument] = useState({});
// const [base64, setBase64] = useState();

// const handlePreview = () => {
//     if (base64) {
//         var newWindow = window.open();

//         newWindow.document.title = document.title;

//         newWindow.document.write(`
//             <html>
//             <head>
//                 <title>${document.title}</title>
//             </head>
//             <body style="margin:0;">
//                 <embed width="100%" height="100%" src="${base64}" type="application/pdf"></embed>
//             </body>
//             </html>
//         `);

//         // Prevent the document from being replaced
//         newWindow.document.close();
//     }
// }
//     useEffect(() => {
//         axios.get(`api/documents/${department}/${id}`, {
//             headers: {
//                 'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`
//             }
//         })
//             .then(response => {
//                 console.log('res', response.data);
//                 setDocument(response.data.data);

//                 axios.get(`api/documents/path/${response.data.data.title}/${response.data.data.format}`, {
//                     headers: {
//                         'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`
//                     }
//                 })
//                     .then(pathResponse => {
//                         console.log('pathLog', pathResponse.data);
//                         setBase64(pathResponse.data.base64);
//                     })
//                     .catch(error => {
//                         console.log('PathError: ', error);
//                     });


//                 // const pathToFile = 'C:/xampp/htdocs/trenutni/internet-tehnologije-projekat-documentmanagement_2017_0347/public/storage/';
//                 // setPath(pathToFile + response.data.data.title + `.${response.data.data.format}`);
//             })
//             .catch(error => {
//                 console.log('Error: ', error);
//             });

//             axios.get(`api/documents/${department}/${id}`, {
//                 headers: {
//                     'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`
//                 }
//             })
//             .then(response => {
//                 console.log('res', response.data);
//                 setDocument(response.data.data);

//                 // const pathToFile = 'C:/xampp/htdocs/trenutni/internet-tehnologije-projekat-documentmanagement_2017_0347/public/storage/';
//                 // setPath(pathToFile + response.data.data.title + `.${response.data.data.format}`);
//             })
//             .catch(error => {
//                 console.log('Error: ', error);
//             });
//     }, [id]);
