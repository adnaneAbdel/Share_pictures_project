import React from 'react'
import './content.css'
import { Link } from 'react-router-dom'


const Content = () => {
    return (
        <div className='container'>
        <div class="row">
   <div class="col-sm-6 col-md-6 col-lg-6 text">
   
       
    <h1 class="h1Title"> Welcome to Share_Pictures</h1>
    <div>
    <p class="introduction">
    
Where Your Moments Come to Life. Dive into a Dynamic Platform for Sharing Your Photos with the World. Create Posts with Captivating Titles and Descriptions, and Share Your Memories Effortlessly. Our Intuitive Interface Makes It Easy to Edit and Update Your Posts Anytime. 
    </p>
    <Link to={'/Register'}><button className='getStarted'>Get Started</button></Link> 
    </div>
 
   </div>
   <div class="col-sm-6 col-md-6 col-lg-6">
     <img src="https://media.istockphoto.com/id/1210881518/es/foto/concepto-de-red-de-comunicaci%C3%B3n-global-las-redes-sociales-negocios-en-todo-el-mundo.jpg?s=2048x2048&w=is&k=20&c=hOCdq3PD2M73Yrw1cHyUPIL8d_acyDz-rm5s0AFzhgc=" alt="" class="img-fluid reduis" srcset="" />
   </div>
 </div>
 <div class="row">
  <div className='col-lg-12 '>
    <h1 className='titlePar'>
    why should to use Share_Pictures
      </h1> 
  </div>
   <div class="col-sm-6 col-md-6 col-lg-6 text">
   
   
    <div>
    <p class="introduction2">
    
    Share_Pictures offers a seamless and intuitive platform for sharing and managing your photos with friends and family. With its user-friendly interface, you can easily upload and share your cherished moments, ensuring they reach your loved ones instantly. Beyond just sharing, Share_Pictures provides robust editing tools that allow you to refine your images directly on the platform, ensuring every photo looks perfect before it's shared. If you change your mind or wish to manage your content, you have complete control over your account; photos can be edited or removed at any time with ease. This flexibility, combined with the security and simplicity of Share_Pictures, makes it an ideal choice for anyone looking to share, edit, and manage their photos effortlessly while staying connected with their social circle.
    </p>

    </div>
 
   </div>
   <div class="col-sm-6 col-md-6 col-lg-6 towImagesHome">
    <div>
    <img src="https://www.transformationmarketing.com/wp-content/uploads/2019/08/TM-5-issues-you-run-into-when-you-overpost-on-social-media.jpg" alt="" class="img-fluid taill" srcset="" />
    </div>
    <div>
    <img src="https://www.postmediasolutions.com/wp-content/uploads/2021/06/how-often-should-you-post-on-social-media.png" alt="" class="img-fluid taill2" srcset="" />
    </div>
   
   </div>
 </div>
        </div>
    )
}


export default Content ;