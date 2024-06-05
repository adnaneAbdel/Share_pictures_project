const express = require('express')
const router = express.Router()
const controllers = require('../Controllers/auth')
const accessToken = require('../Middleware/accessToken')



router.post('/login', controllers.Login)
router.post('/register', controllers.Register)
router.post('/post',accessToken, controllers.Post)
router.post('/home', controllers.Home)
router.get('/dashboard/:userId',accessToken, controllers.Dsahbord)
router.delete('/post/:postId',accessToken, controllers.Deleted)
router.put('/post/:postId',accessToken, controllers.Update)
router.get('/post/:postId/likes', controllers.PostLikes)


module.exports = router