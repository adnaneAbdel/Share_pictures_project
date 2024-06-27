
import React, { useEffect, useState } from 'react';
import './Dashborad.css'
import {Link} from 'react-router-dom'
import ButtonWindow from './windowsPost/button'
import EditPostModal from './windowsPost/EditWindow';
import {jwtDecode} from 'jwt-decode';
import defaultUser from './images/defaultUser.png'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import Swal from 'sweetalert2';
const Dashborad = ({imageUrl}) => {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate()

    const [posts, setPosts] = useState([]);

   
      
    useEffect(() => {
        // Retrieve JWT from local storage
        const token = localStorage.getItem('token');
       
        if (!token) {
          navigate('/login');
          return;
        }
          try {
            // Decode JWT to extract user information
            const decodedToken = jwtDecode(token);
           
            // Set user name in state
            setUserName(decodedToken.name);
           
  
             // Fetch posts for the logged-in user
             axios.post('http://localhost:3000/api/auth/my-posts', {}, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          })
          .then(response => {
              setPosts(response.data.posts);
          })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
          } catch (error) {
            console.error('Error decoding JWT:', error);
          }
        
      }, [navigate]);
      const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token
       
      };
      const handleEditPost = (postId) => {
       
        console.log("Editing post with id:", postId);
      };
      const handleRemovePost = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            // Show the confirmation dialog
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            });
    
            // Proceed with deletion only if the user confirms
            if (result.isConfirmed) {
                await axios.delete(`http://localhost:3000/api/auth/post/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // Show success message after deletion
                Swal.fire({
                    title: "Deleted!",
                    text: "Your post has been deleted.",
                    icon: "success"
                });
                // Update posts state to remove the deleted post
                setPosts(posts.filter(post => post._id !== postId));
            }
        } catch (error) {
            console.error('Error removing post:', error);
        }
    };
  
    
    return (
        <div class="pageFlex">
        <div class="SectionDashbord ">
      
        <div class="myName  p-20 m-20 font-s30 text-c" id="myName"></div>
        <div class="progressAdn"><span class="circul"></span></div>
   
      
        <ul class="ulForIcons">
            <li>
                <div class="active aForLinks">
                    <i class="bi bi-bar-chart"></i>
                    <span class="Dasbord">Dashboard</span>
                </div>
            </li>
            <li>
                <a href="setting.html" class="aForLinks non-clickable">
                    <i class="bi bi-gear"></i>
                    <span class="Dasbord">Settings</span>
                </a>
            </li>
            <li>
            <Link to={'/UserProfile'} class="aForLinks">  
                    <i class="bi bi-person-fill"></i>
                   <span class="Dasbord">Profile</span></Link>
            
            </li>
           
           
            <li>
                <a href="friends.html" class="aForLinks non-clickable">
                    <i class="bi bi-people"></i>
                    <span class="Dasbord">Friends</span>
                </a>
            </li>
           
            
            </ul>
       
    </div>
    <div class="SectionContune bag-white">
    <div class="nav">
       
        <div class="ForProfil">
          
            <div class="profilImg">
                <img   src={defaultUser}  alt="Profile" width="50px" height="50px" className='imgUser'/> 
               
            </div>
            <span className='nameOfuser'> {userName && <span> {userName}</span>}</span>
        </div>
        <div class="inputKey">
          <Link  onClick={handleLogout}  to={'/Login'}>  <i class="bi bi-box-arrow-in-right" id="searchIcon"></i> </Link>
        </div>

    </div>
    <div class="container">
                <div class="infoPage">
                    <div class="titleForPage">
                        Dashboard
                    </div>
                    <div class="progrss"><span class="progressTop"></span></div>
                </div>
                <div class="towSectionWelcomAndQuickDraft">
                    <div class="sectinWelcome">
                        <div class="backgroundForFirstSection">
                            <div class="firstTitl">
                                Welcome
                                <p class="nameOfUser"> {userName && <span>{userName}</span>}</p>
                            </div>
                          
                        </div>
                       
                        <div class="informationUser">
                            <div class="name">
                            {userName && <span>{userName}</span>}
                                <p class="nameOfUser1">New user</p>
                            </div>
                            <div class="project">
                                {posts.length}
                                <p class="nameOfUser1">Posts</p>
                            </div>
                           
                        </div>
                        <Link to={'/UserProfile'}>     <button class="btnRightProfil">
                            profile
                        </button> </Link>



                    </div>
                    <div class="sectinQuickDarft">
                        <div class="firstTitl">
                           Get Started
                            <p class="nameOfUser">Share Your Moments </p>
                        </div>
                        <div className='btnSection'>

                     {/* //this line have other wondows */}
                     <div>
                     <ButtonWindow/>
                        </div> 
                      <div>
                    <Link to={'/Posts'}>  <button className='LooksPosts'>Look Posts</button></Link>
                        </div> 
                       </div>
                    </div>
                </div>
                {/* table section  */}
           
            <div className="towSectionWelcomAndQuickDraft">
              <div className="sectinProject">
                <div className="backgroundForFirstSection">
                  <div className="firstTitl">Privews Posts</div>
                  <table border="0">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map(post => (
                        <tr key={post._id}>
                          <td> 
                          {post.imageUrl ? (
                     <img src={`http://localhost:3000/${post.imageUrl}`} alt="" width="30px" height="30px" id="circulImg" />
                             ) : (
                             <span>No Image</span>
                         )}
                          </td>
                          <td>{post.title}</td>
                          <td className='btntable'>
                            <div className='buttons'>
                          <div>
                          <button className='Rejected' onClick={() => handleRemovePost(post._id)}>remove</button>
                          </div>
                          <div>
                          <EditPostModal  postId={post._id} handleEditPost={handleEditPost} modalId={`editPostModal-${post._id}`}/>
                          </div>
                          </div>
                         
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          
                </div>
    </div>
    </div>
    )
}


export default Dashborad ;