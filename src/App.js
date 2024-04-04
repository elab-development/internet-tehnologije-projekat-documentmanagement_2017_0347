import React , {useState} from "react";
import './App.css';

import {Home} from './Home';
import {BrowserRouter as Router , Routes, Route, Link} from 'react-router-dom'
import Authentication from "./components/Authentication";
import MakeDocument from "./components//Documents/MakeDocument";
import { DOCUMENTS } from "./constants";
import Documents from "./components/Documents/Documents";
import OneDocument from "./components/Documents/OneDocument";


function App() {

  const [documents, setDocuments] = useState(DOCUMENTS);

  return (
    <div className="App">
      {
        <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path='/login' element={<Authentication/>}/>
          <Route path='/documents/:department' element={<Documents data = {documents}/>}/>
          <Route path='/documents/:department/make' element={<MakeDocument/>}/>
          <Route path='/document/:id' element={<OneDocument data={documents} />} />
        </Routes>
        </Router>
        //currentForm === "login" ? <Login onFormSwitch = {toggleForm}/> : <Register onFormSwitch = {toggleForm}/>
      }
    </div>
  );
}

export default App;
