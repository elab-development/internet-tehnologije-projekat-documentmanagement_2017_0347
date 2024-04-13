import { Login } from "./Login";
import { Register } from "./Register";
import {useState} from 'react';

const Authentication = ({authenticate, registrate})=>{
    const [currentForm, setCurrentForm] = useState('login');

    const toggleForm = (formName) => {
      setCurrentForm(formName);
    }
    return (currentForm === "login" 
    ? <Login  onFormSwitch = {toggleForm} authenticate={authenticate}/> 
    : <Register onFormSwitch = {toggleForm} registrate={registrate} authenticate={authenticate}/>)
}
export default Authentication; 