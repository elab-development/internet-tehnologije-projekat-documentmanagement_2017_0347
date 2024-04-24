import { Login } from "./Login";
import { Register } from "./Register";
import ChangePassword from "./ChangePassword";
import {useState} from 'react';

const Authentication = ({authenticate, registrate,changePass})=>{
    const [currentForm, setCurrentForm] = useState('login');

    const toggleForm = (formName) => {
      setCurrentForm(formName);
    }
    return (<>
      {currentForm === 'login' &&  <Login  onFormSwitch = {toggleForm} authenticate={authenticate}/> }
      {currentForm === 'register' &&  <Register onFormSwitch = {toggleForm} registrate={registrate} authenticate={authenticate}/>}
      {currentForm === 'change-pass' &&  <ChangePassword onFormSwitch = {toggleForm} changePass={changePass} />}
      </>)
}
export default Authentication; 