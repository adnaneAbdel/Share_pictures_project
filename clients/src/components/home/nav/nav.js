import React from 'react'
import {Link} from 'react-router-dom'
import './nav.css'
import Logo from './images/LogoSharePictures.png'
const Nav = () => {
    return (
        <div>
  
        <nav class="navbar navbar-expand-lg navbar-light boxing fixed-top">
        <div class="container-fluid">
        <a class="navbar-brand" href="self"><img src={Logo} alt="" srcset="" width="80px" height="80px" class="firstLogo"/>
        <a class="navbar-brand" id="myName" href="#adnane">Share_Pictures</a>
        </a>
          
     
      
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            </ul>
         
          <Link to={'/Login'}><button className='Login'>login</button></Link> 
          <Link to={'/Register'}> <button className='Register'>Register</button></Link>
                   
          </div>
        </div>
      </nav>
              
              </div>
    )
}


export default Nav ;