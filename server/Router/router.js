const express = require('express')
const router = express.Router()
const controllers = require('../Controllers/auth')
const accessToken = require('../Middleware/accessToken')
const upload = require('../Middleware/multerConfig')
const authenticateToken = require('../Middleware/authenticateToken')
const {validateRegister, validateLogin , validatePost} = require('../Controllers/validationForm')
//access login
router.post('/login', validateLogin,controllers.Login)
//access register
router.post('/register',validateRegister,controllers.Register)
//create post with verfy token
router.post('/post',accessToken, upload.single('imageUrl'),validatePost,controllers.Post)
//get all the post from users
router.post('/home', controllers.Home )
//get all post created by one user : 
router.post('/my-posts', accessToken,controllers.Myposts)
//get post by id : 
router.get('/post/:postId', accessToken,controllers.GetPostById)
//updateUserInfo :
router.put('/UpdateUser', accessToken, authenticateToken ,controllers.UpdateUser)
router.get('/dashboard/:userId',accessToken, controllers.Dsahbord)
//deleted post from user 
router.delete('/post/:postId',accessToken, controllers.Deleted)
//update post from user 
router.put('/post/:postId',accessToken, controllers.Update)
//like post from user 
router.post('/post/:postId/likes', accessToken,controllers.PostLikes)
//get number of like and name : 
router.get('/post/:postId/like', accessToken, controllers.getPostLikes);
//upload iamge porfile : 
router.post('/uploadProfilePicture', authenticateToken, upload.single('imageUrl'), controllers.uploadProfilePicture);
// For unauthenticated users
router.get('/post/:postId/like/count', controllers.getLikesCount);


module.exports = router