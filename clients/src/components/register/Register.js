import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertPasswordMismatch, setShowAlertPasswordMismatch] = useState(false);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setShowAlertPasswordMismatch(true);
      setTimeout(() => {
        setShowAlertPasswordMismatch(false);
      }, 5000);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        name,
        email,
        password
      });
      localStorage.setItem('token', response.data.data);
      navigate('/Dashborad');
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors([{ msg: 'Registration failed. Please try again.' }]);
      }
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
  };

  return (
    <div className="container">
      <div className='auth colo-sm-6 wid'>
        <form onSubmit={handleSubmit}>
          {showAlert && (
            <div className="alert alert-danger mt-3" role="alert">
              {errors.map((error, index) => (
                <p key={index}>{error.msg}</p>
              ))}
            </div>
          )}
          {showAlertPasswordMismatch && (
            <div className="alert alert-danger mt-3" role="alert">
              Passwords do not match. Please try again.
            </div>
          )}
          <h5 className="mb-4 text-center">Create Now Account</h5>
          <div className="form-group">
            <label htmlFor="exampleInputName">Name</label>
            <input
              type="text"
              className="form-control mt-2 mb-1"
              value={name}
              onChange={handleChangeName}
              id="exampleInputName"
              autoFocus
              
              aria-describedby="nameHelp"
              placeholder="Your Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputEmail">Email</label>
            <input
              type="email"
              className="form-control mt-2 mb-1"
              value={email}
              onChange={handleChangeEmail}
              id="exampleInputEmail"
              
              aria-describedby="emailHelp"
              placeholder="Your Email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword">Password</label>
            <input
              type="password"
              className="form-control mt-2 mb-1"
              value={password}
              onChange={handleChangePassword}
              id="exampleInputPassword"
              
              placeholder="Password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputConfirmPassword">Confirm Password</label>
            <input
              type="password"
              className="form-control mt-2 mb-1"
              value={confirmPassword}
              onChange={handleChangeConfirmPassword}
              id="exampleInputConfirmPassword"
              
              placeholder="Confirm Password"
            />
          </div>
          <div className='center'>
            <button type="submit" className="btn btn-primary mt-4">Register</button>
            <br />
            <small><Link to="/Login">Sign in</Link></small>
            <p className="m-3 text-muted">&copy; 2024 - 2025</p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
