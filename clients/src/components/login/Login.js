import { Link } from 'react-router-dom';
import './Login.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3000/api/auth/login`, {
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
        setErrors([{ msg: 'Invalid email or password' }]);
        console.log(process.env.REACT_APP_API_URL)
      }
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
  };

  return (
    <div className="container">
      <div className="auth col-sm-6 wid">
        {showAlert && (
          <div className="alert alert-danger mt-3" role="alert">
            {errors.map((error, index) => (
              <p key={index}>{error.msg}</p>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <h5 className="mb-4 text-center">Login</h5>

          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email</label>
            <input
              type="email"
              className="form-control mt-2 mb-1"
              value={email}
              name="username"
              onChange={handleChangeEmail}
              id="exampleInputEmail1"
              autoFocus
              
              aria-describedby="emailHelp"
              placeholder="Your Email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input
              type="password"
              className="form-control mt-2 mb-1"
              value={password}
              name="password"
              onChange={handleChangePassword}
              id="exampleInputPassword1"
              
              placeholder="Password"
            />
          </div>
          <div className="center">
            <button type="submit" className="btn btn-primary mt-4">
              Sign in
            </button>
            <br />
            <small>
              <Link to="/Register">Create Account</Link>
            </small>
            <p className="m-3 text-muted">&copy; 2024 - 2025</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
