import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; 
import defaultUser from '../dashborad/images/defaultUser.png';

const UserProfile = ({ user = {}, onDelete, profilePicture }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    profilePicture: user.profilePicture || localStorage.getItem('profilePicture') || defaultUser,
    name: user.name || '',
    email: user.email || '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserData((prevData) => ({
          ...prevData,
          name: decoded.name || '',
          email: decoded.email || '',
        }));
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profilePicture', file);

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:3000/api/auth/uploadProfilePicture',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        const { profilePicture } = response.data.user;
        const fullPath = `http://localhost:3000/${profilePicture}`;
        setUserData((prevData) => ({
          ...prevData,
          profilePicture: fullPath,
        }));
        localStorage.setItem('profilePicture', fullPath);
      } catch (error) {
        alert('Failed to update profile picture.');
        console.error('Error updating profile picture:', error);
      }
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:3000/api/auth/UpdateUser',
        {
          name: userData.name,
          email: userData.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Update response:', response.data);
      setUserData(response.data.user);
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update user information.');
      console.error('Error updating user:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/Login';
  };

  return (
    <div className="pageFlex">
      <div className="SectionDashbord">
        <div className="myName p-20 m-20 font-s30 text-c" id="myName"></div>
        <div className="progressAdn">
          <span className="circul"></span>
        </div>
        <ul className="ulForIcons">
          <li>
            <Link to={'/Dashborad'} className="active aForLinks">
              <i className="bi bi-bar-chart"></i>
              <span className="Dasbord">Dashboard</span>
            </Link>
          </li>
          <li>
            <a href="setting.html" className="aForLinks non-clickable">
              <i className="bi bi-gear"></i>
              <span className="Dasbord">Settings</span>
            </a>
          </li>
          <li>
            <Link to={'/UserProfile'} className="aForLinks">
              <i className="bi bi-person-fill"></i>
              <span className="Dasbord">Profile</span>
            </Link>
          </li>
          <li>
            <a href="friends.html" className="aForLinks non-clickable">
              <i className="bi bi-people"></i>
              <span className="Dasbord">Friends</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="SectionContune bag-white">
        <div className="nav">
          <div className="ForProfil">
            <div className="profilImg">
              <label htmlFor="profileImageUpload">
                <img
                  src={defaultUser}
                  alt="Profile"
                  width="50px"
                  height="50px"
                  className="imgUser"
                />
              </label>
       
            </div>
            <span className="nameOfuser">{userData.name || 'User Name'}</span>
          </div>
          <div className="inputKey">
            <Link onClick={handleLogout} to={'/Login'}>
              <i className="bi bi-box-arrow-in-right" id="searchIcon"></i>
            </Link>
          </div>
        </div>

        <div className="container">
          <div className="user-profile">
            <div className="user-profile__info">
              <div className="user-profile__details">
                <label className="nameLabel">Name</label><br />
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    className="user-profile__input"
                  />
                ) : (
                  <div className="user-profile__name">{userData.name || 'User Name'}</div>
                )}
                <label className="nameLabel">Email</label><br />
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    className="user-profile__input"
                  />
                ) : (
                  <div className="user-profile__email">{userData.email || 'user@example.com'}</div>
                )}
              </div>
            </div>
            <div className="user-profile__actions">
              {isEditing ? (
                <button className="user-profile__button" onClick={handleSave}>Save</button>
              ) : (
                <button className="user-profile__button" onClick={() => setIsEditing(true)}>Edit Info</button>
              )}
              <button className="user-profile__button user-profile__button--delete non-clickable" onClick={onDelete}>Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
