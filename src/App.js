import React, { useState, useEffect } from "react";
import './App.css';

import { Home } from './Home';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Authentication from "./components/Authentication";
import MakeDocument from "./components//Documents/MakeDocument";
import { DOCUMENTS } from "./constants";
import { EMPLOYEES } from "./constants";
import Documents from "./components/Documents/Documents";
import OneDocument from "./components/Documents/OneDocument";
import uuid from 'react-uuid';
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {

  const [documents, setDocuments] = useState(DOCUMENTS);
  const [employees, setEmployees] = useState(EMPLOYEES);
  //za korisnike iz "baze"
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDocumentDeleted, setIsDocumentDeleted] = useState(false);

  useEffect(() => {
    if (isDocumentDeleted) {
      setTimeout(() => {
        setIsDocumentDeleted(false);
      }, 5000)
    }
  }, [isDocumentDeleted]);


  const authenticate = (email, pass) => {
    const user = employees.find(employee => employee.email === email && employees.password === pass);
    if (user) {
      setIsAuthenticated(true);
      setUserId(user.id);
    }
  }
  const registrate = (emName, email, pass, role, department) => {
    const user = employees.find(employee => employee.email === email && employees.password === pass);
    const empl = {
      id: uuid(),
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
      authenticate(empl.email, empl.password);

    }
  }

  const addDocument = (document) => {
    // setDocuments((oldDocuments)=>[...oldDocuments,document])
    if (document.id === null) {
      //dodavanje
      setDocuments((oldDocuments) => [...oldDocuments, { ...document, id: uuid() }])
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
  const addEmployee = (employee) => {
    setEmployees((oldEmployees) => [...oldEmployees, employee])
  }
  const deleteDocument = (documentId) => {
    setDocuments((oldDocuments) => oldDocuments.filter((document) => document.id != documentId));
    setIsDocumentDeleted(true);
  }
  return (
    <div className="App">
      {
        <Router>
          <Header />
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/login' element={<Authentication authenticate={authenticate} registrate={registrate} />} />
            <Route path='/documents/:department' element={<Documents data={documents} isDocumentDeleted={isDocumentDeleted} />} />
            <Route path='/documents/:department/make/:id?' element={<MakeDocument data={documents} addDocument={addDocument} userId={userId} />} />
            <Route path='/document/:department/:id' element={<OneDocument deleteDocument={deleteDocument} dataDocs={documents} dataEmp={employees} />} />
          </Routes>
          <Footer />
        </Router>
      }
    </div>
  );
}

export default App;
