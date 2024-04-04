import { useParams } from 'react-router-dom';

const OneDocument = (props) => {
    const { id } = useParams();
    
    console.log('id', id);
    console.log(props);

    const document = props.data.find(element => element.id == id)
    console.log('document', document)
    return (
        <div>
            {document.title}
            <br />
            {document.text}
            <br />
            {document.date}
            <br />
            {document.format}
        </div>
    )

}

export default OneDocument;
