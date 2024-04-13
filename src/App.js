import React , {useState} from "react";
import './App.css';

import {Home} from './Home';
import {BrowserRouter as Router , Routes, Route, Link} from 'react-router-dom'
import Authentication from "./components/Authentication";
import MakeDocument from "./components//Documents/MakeDocument";
import { DOCUMENTS } from "./constants";
import { EMPLOYEES } from "./constants";
import Documents from "./components/Documents/Documents";
import OneDocument from "./components/Documents/OneDocument";


function App() {

  const [documents, setDocuments] = useState(DOCUMENTS);
  const [employees, setEmployees] = useState(EMPLOYEES);
  const [userId, setUserId]=useState(null);
  const [isAuthenticated, setIsAuthenticated]=useState(false);

  const authenticate = (email,pass)=> {
     const user = employees.find(employee => employee.email === email && employees.password === pass);
     if(user){
      setIsAuthenticated(true);  
      setUserId(user.id);
     }
  }
  const registrate = (emName, email, pass, role, department) => {
    const user = employees.find(employee => employee.email === email && employees.password === pass);
    const empl = {
      name: emName,
      email: email,
      password: pass,
      role: role,
      department: department
    };
    if (user) {
      //vec postoji, povratak naloga
    } else {
      addEmployee(empl);
      authenticate(empl.email,empl.password);
      
    }
  }

const addDocument=(document)=>{
 // setDocuments((oldDocuments)=>[...oldDocuments,document])
 if (document.id === null) {
  //dodavanje
  setDocuments((oldDocuments) => [...oldDocuments, document])
} else {
  setDocuments(
    (oldDocuments) => oldDocuments.map(element => {
      if (element.id === document.id) {
        return document;
      } 
      return element;
    })
  )
}
   
}
const addEmployee =(employee)=>{
  setEmployees((oldEmployees)=>[...oldEmployees,employee])
}
  return (
    <div className="App">
      {
        <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path='/login' element={<Authentication authenticate={authenticate} registrate={registrate} />}/>
          <Route path='/documents/:department' element={<Documents data = {documents}/>}/>
          <Route path='/documents/:department/make/:id?' element={<MakeDocument data = {documents} addDocument={addDocument} userId = {userId}/>}/>
          <Route path='/document/:id' element={<OneDocument dataDocs={documents} dataEmp = {employees}/>} />
        </Routes>
        </Router>
      }
    </div>
  );
}

export default App;
