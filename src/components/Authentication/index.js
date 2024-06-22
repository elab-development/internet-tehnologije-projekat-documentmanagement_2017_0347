import { Login } from "./Login";
import { Register } from "./Register";
import ForgotPassword from "./ForgotPassword";
import ChangePassword from "./ChangePassword";
import {useState} from 'react';
// koji je razlika izmedju import Komponenta i import {Komponenta}

const Authentication = ({authenticate, registrate,changePass, sendCode,departments})=>{
    const [currentForm, setCurrentForm] = useState('login');

    const toggleForm = (formName) => {
      setCurrentForm(formName);
    }
    return (<>
      {currentForm === 'login' &&  <Login  onFormSwitch = {toggleForm} authenticate={authenticate}/> }
      {currentForm === 'register' &&  <Register onFormSwitch = {toggleForm} registrate={registrate} departments={departments} />}
      {currentForm === 'change-pass' &&  <ForgotPassword onFormSwitch = {toggleForm} sendCode={sendCode} />}
      {currentForm === 'reset-password' &&  <ChangePassword onFormSwitch = {toggleForm} changePass={changePass} />}
      </>)
}
export default Authentication; 