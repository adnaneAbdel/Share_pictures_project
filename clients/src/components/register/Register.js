import React, { useState } from 'react'
import {Link} from 'react-router-dom';
import './Register.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [getName , setGetName] = useState('')
  const [getMail , setGetMail] = useState('')
  const [getPass , setGetPass] = useState('')
  const [getConfirmePass , setGetConfirmePass] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [showAlertErorrPass, setShowAlertErorrPass] = useState(false)
  const navigate = useNavigate()

  const handleChangeName = (e) => {
    setGetName(e.target.value)
  }
  const handleChangeMail = (e) => {
    setGetMail(e.target.value)
  }
  const handleChangePass = (e) => {
    setGetPass(e.target.value)
  }
  const handleChangeConfirmePass = (e) => {
    setGetConfirmePass(e.target.value)
  }

  const handlerOnSubmit = async (e) => {
    e.preventDefault();
    if(getPass !== getConfirmePass){
      setShowAlertErorrPass(true)
      setTimeout(() => {
        setShowAlertErorrPass(false)
      }, 5000);
      return;

    }
   try {
    const response = await axios.post('http://localhost:3000/api/auth/register',{
      name: getName,
      email: getMail,
      password: getPass
    })
    localStorage.setItem('token', response.data.data);
    if(getPass === getConfirmePass){
      navigate('/Dashborad')
    }
   } catch (error) {
    console.log(error)
    setShowAlert(true)
    setTimeout(() => {
      setShowAlert(false)
    }, 5000);
    
   }
  }
    return (
        <div className="container">
            <div className='auth colo-sm-6 wid'>
            <form onSubmit={handlerOnSubmit}>
              {showAlert && (
                  <div class="alert alert-danger mt-3" role="alert">
                  The email already exit . Please try again.
                </div>
              )}
               {showAlertErorrPass && (
                  <div class="alert alert-danger mt-3" role="alert">
                  Password do not match. Please try again.
                </div>
              )}
                <h5 className="mb-4 text-center">Create Now Account</h5>
  <div class="form-group">
    <label for="exampleInputEmail1" >Name</label>
    <input type="text" class="form-control mt-2 mb-1" value={getName} name="name" onChange={handleChangeName} id="exampleInputEmail1" autoFocus required aria-describedby="emailHelp" placeholder="Your Name"/>
  
  </div>
  <div class="form-group">
    <label for="exampleInputEmail1">Email</label>
    <input type="email" class="form-control mt-2  mb-1" value={getMail} name="username" onChange={handleChangeMail} id="exampleInputEmail1" required aria-describedby="emailHelp" placeholder="Your Email"/>
  
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" class="form-control mt-2  mb-1" minLength={'6'} value={getPass} name="password" onChange={handleChangePass} id="exampleInputPassword1" required placeholder="Password"/>
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Confirme Password</label>
    <input type="password" class="form-control mt-2  mb-1" value={getConfirmePass} name="password" onChange={handleChangeConfirmePass} id="exampleInputPassword1" required placeholder="Confirme Password"/>
  </div>
  <div className='center'>
  <button type="submit" class="btn btn-primary mt-4 ">Resgiter</button><br/>
<small > <Link to={"/Login"}>sing in </Link></small>
  <p className="m-3 text-muted" >&copy; 2024 - 2025</p>
  </div>
</form>
</div>
        </div>
    )
}


export default Register ;