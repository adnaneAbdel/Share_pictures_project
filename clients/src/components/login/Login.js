import {Link} from 'react-router-dom';
import './Login.css'
import { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';




const  Login = () =>{
 const [getvalueOfMail , setGetvalueOfMail] = useState('')
 const [getvalueOfPass , setGetvalueOfPass] = useState('')
 const [showAlert, setShowAlert] = useState(false);
 const navigate = useNavigate()
const handlerChangeMail = (e) => {
  setGetvalueOfMail(e.target.value)
}
const handlerChangePass = (e) => {

  setGetvalueOfPass(e.target.value)
}
const handlerOnSubmit = async (e) => {
  e.preventDefault();
try {
  const response = await axios.post('http://localhost:3000/api/auth/login',{
    email: getvalueOfMail,
    password: getvalueOfPass
  });
  localStorage.setItem('token', response.data.data);
  navigate('/Dashborad');
} catch (error) {
  console.error('Error:', error);
  setShowAlert(true);
  setTimeout(() => {
    setShowAlert(false);
  }, 5000);
}
}
    return (
        <div className="container">
         
            <div className='auth  colo-sm-6 wid'>
            {showAlert && (
          <div class="alert alert-danger mt-3" role="alert">
            Invalid email or password. Please try again.
          </div>
        )}
            <form  onSubmit={handlerOnSubmit}>
                <h5 className="mb-4 text-center">Login in</h5>
 
  <div class="form-group">
    <label for="exampleInputEmail1">Email</label>
    <input type="email" class="form-control mt-2  mb-1" value={getvalueOfMail} name="username" onChange={handlerChangeMail} id="exampleInputEmail1" autoFocus required aria-describedby="emailHelp" placeholder="Your Email"/>
  
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" class="form-control mt-2  mb-1" value={getvalueOfPass} name="password" onChange={handlerChangePass} id="exampleInputPassword1" required placeholder="Password"/>
  </div>
<div className='center'>
  <button type="submit" class="btn btn-primary mt-4 ">Sing in</button><br/>
<small > <Link to={"/Register"}>Create Account </Link></small>
  <p className="m-3 text-muted" >&copy; 2024 - 2025</p>
  </div>
</form>

</div>
        </div>
    )
}

export default Login ;