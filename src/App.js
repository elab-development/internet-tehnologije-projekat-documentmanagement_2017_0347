import React , {useState} from "react";
import './App.css';

import {Home} from './Home';
import {BrowserRouter as Router , Routes, Route, Link} from 'react-router-dom'
import Authentication from "./components/Authentication";

function App() {


  return (
    <div className="App">
      {
        < Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path='/login' element={<Authentication/>}/>
        </Routes>
        </Router>
        //currentForm === "login" ? <Login onFormSwitch = {toggleForm}/> : <Register onFormSwitch = {toggleForm}/>
      }
    </div>
  );
}

export default App;
