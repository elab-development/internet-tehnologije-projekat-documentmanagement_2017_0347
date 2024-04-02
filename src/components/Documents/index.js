import React from 'react'
import { useParams } from 'react-router-dom';
import Header from '../Header';
import NavBar from '../NavBar';

const Documents = () => {
    const {department} = useParams();
    return(
        <>
        <div>
            <Header/>
            <NavBar/>
            These are the {department} documents:
        </div>
        </>
    )
}

export default Documents;