import { Login } from "./Login";
import { Register } from "./Register";
import {useState} from 'react';

const Authentication = ({authenticate})=>{
    const [currentForm, setCurrentForm] = useState('login');

    const toggleForm = (formName) => {
      setCurrentForm(formName);
    }
    return (currentForm === "login" ? <Login  onFormSwitch = {toggleForm} authenticate ={authenticate }/> : <Register onFormSwitch = {toggleForm}/>)
}
export default Authentication;