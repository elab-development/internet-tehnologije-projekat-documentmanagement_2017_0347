import React, { useState, useEffect } from "react";
import './App.css';

import { Home } from './Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Authentication from "./components/Authentication";
import MakeDocument from "./components//Documents/MakeDocument";
import Documents from "./components/Documents/Documents";
import TagBar from "./components/Documents/TagBar";
import OneDocument from "./components/Documents/OneDocument";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import axios from "axios";
import UploadPage from "./components/Documents/UploadPage";
import UploadPage2 from "./components/Documents/UploadPage2";

function App() {
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [isDocumentDeleted, setIsDocumentDeleted] = useState(false);
  const [departments, setDepts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tags, setTags] = useState([]);
  const [docutags, setDocutags] = useState([]);

  useEffect(() => {
    loadDepts();
  }, []);
  //hoce li vratiti i novo  registrovanog
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadDepts = async () => {
    try {
      const response = await axios.get('api/departments');
      setDepts(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  const loadEmployees = async () => {
    try {
      const response = await axios.get('api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  // const loadDocutags = async () => {
  //   try {
  //     const response = await axios.get('api/tags');
  //     setDocutags(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const authenticate = async (email, password) => {
    try {
      const response = await axios.post(
        'api/login',
        { email: email, password: password });
      if (response.data.success) {
        var authToken = response.data.access_token;
        window.sessionStorage.setItem(
          "auth_token",
          authToken.slice(authToken.indexOf('|') + 1));
        setIsAuthenticated(true);
        setUserId(response.data.empId);
      }
    } catch (error) { throw error };
  }
  const registrate = async (emName, email, pass, role, department) => {
    // Ako pstoji mejl u bazi change pass 
    try {
      const response = await axios.post('api/register', {
        name: emName,
        email: email,
        password: pass,
        role: role,
        department_fk: department
      });
      if (response) {
        console.log(response.data);
      }
    } catch (error) { throw error }
    //console.warn('Couldnt authenticate user');  
  }

  const sendCode = (email) => {
    axios.post(
      'http://localhost:8000/api/forgot-password',
      { email: email })
      .then((response) => {
      })
      .catch(() => {
        console.warn('Couldn\'t send code, check if email is correct.');
      });
  }
  const changePass = (email, code, password, confirmPassword) => {
    axios.post(
      'http://localhost:8000/api/reset-password',
      { email: email, code: code, password: password, confirm_password: confirmPassword })
      .then((response) => {
      })
      .catch(() => {
        console.warn('Couldn\'t reset password, check if the parameters are correct.');
      });
  }
  // const deleteDocument = async (documentId, department) => {
  //   try {
  //     var res = await axios.delete(`api/documents/${department}/${documentId}/${userId}/delete`, {
  //       headers: {
  //         'Authorization': `Bearer ${window.sessionStorage.getItem("auth_token")}`
  //       }
  //     });

  //     if (res) {
  //       setIsDocumentDeleted(true);
  //       console.log(res.data);
  //     }
  //   }
  //   catch (err) { throw err }
  // }
  return (
    <div className="App">
      {
        <Router>
          <Header />
          <NavBar departments={departments} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/login' element={<Authentication authenticate={authenticate} registrate={registrate} changePass={changePass} sendCode={sendCode} departments={departments} />} />
            <Route path='/documents/:department' element={<Documents employees={employees} userId={userId} departments={departments} />} />
            <Route path='/documents/:department/make/:id?' element={<MakeDocument userId={userId} />} />
            <Route path='/document/:department/:id' element={<OneDocument />} />
            <Route path="/documents/:department/upload" element={<UploadPage2 userId={userId} />} />
          </Routes>
          <Footer />
        </Router>
      }
    </div>
  );
}
export default App;
