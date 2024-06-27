const TableUser = require('../database/user');
const TablePost = require('../database/post')
const bcrypt = require('bcrypt');
const { generateToken }  = require('../Controllers/jwt'); 
const { validationResult } = require('express-validator');


// Login function
exports.Login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email , password} = req.body
 try {
  const user = await TableUser.findOne({email})
  if(!email){
    res.status(401).json({ message: 'Invalid email or password' })
  }
  const isMatch = await bcrypt.compareSync(password, user.password)
  if(!isMatch){
    res.status(401).json({ message: 'Invalid email or password' })
  }
  const token = generateToken(user);  
  res.status(200).json({message: 'your in the dashbord right now ', data: token})

 } catch (error) {
  return next(error);
 }
}

// Register function
exports.Register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await TableUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new TableUser({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate token
    const token = generateToken(user);   

    res.status(200).json({
      message: "New user registered successfully",
      data: token
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Create Post function 
exports.Post = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { title , description } = req.body
  const userId = req.user.id;

 try {
  const imageUrl = req.file ? req.file.path : null; 
  const post = await TablePost.create({
    userId,
    title,
    description,
    imageUrl,
    createdAt: new Date() 
  })
  await post.save()
  res.status(200).json({message: "the new post added successfull",info: post})
 } catch (error) {
  res.status(400).json({ message: 'Error uploading post', error });
 }
}

//show all posts  function 
exports.Home = async (req, res , next ) => {
 
  try {
    const posts = await TablePost.find().populate('userId', 'name');
    res.status(200).json({posts})
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
}
//fetch the post-user :
exports.Myposts = async (req, res ,next) => {
  try {
    const userId = req.user.id; 
    const posts = await TablePost.find({ userId: userId }); 
    res.json({ posts });
} catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
}
}
//dashboard function 
exports.Dsahbord = async (req, res, next ) => {
  const {userId} = req.params
 try {
    // Fetch the user by ID
    const user = await TableUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch the posts created by the user
    const userPosts = await TablePost.find({ userId: userId });
  res.status(200).json({
      postCount: userPosts.length,
      posts: userPosts,
  })
 } catch (error) {
  res.status(500).json({ message: 'Error fetching posts', error: error.message });
 }
}

//deleted post form user 
exports.Deleted = async (req, res , next) => {
  const {postId} = req.params
  const userId = req.user.id;
 try {
  const post = await TablePost.findById(postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  if (post.userId.toString() !== userId) {
    return res.status(403).json({ message: 'You do not have permission to delete this post' });
  }
  await TablePost.findByIdAndDelete(postId)
  res.status(200).json({message  : "the post deleted successfull", info : post})
 } catch (error) {
  res.status(500).json({ message: 'Error deleting post', error: error.message });
 }
}

//update psot form user : 
exports.Update   = async (req,res ,next) => {
  const {postId} = req.params
  const userId = req.user.id;
  const { title, description, imageUrl } = req.body;
  try {
    const post = await TablePost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this post' });
    }
    const updatedPost = await TablePost.findByIdAndUpdate(
      postId,
      { title, description, imageUrl },
      { new: true } // This option returns the updated document
    );
    
    // Check if the post was successfully updated
    if (!updatedPost) {
      return res.status(500).json({ message: 'Error updating post: Post could not be updated' });
    }
    res.status(200).json({ message: 'The post was updated successfully', info: updatedPost });
   } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
   }
}
//get psot by ID :
exports.GetPostById = async (req, res, next) => {
  const { postId } = req.params;
  if (!postId) {
    return res.status(400).json({ message: 'Post ID is required' });
  }

  try {
    const post = await TablePost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
} 
//post like form user 
exports.PostLikes = async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const user = await TableUser.findById(userId);
    const post = await TablePost.findById(postId);

    if (!post) {
      return res.status(400).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.findIndex((like) => like.userId.toString() === userId);

    if (likeIndex > -1) {
      // User has already liked the post, so remove the like
      post.likes.splice(likeIndex, 1);
    } else {
      // User hasn't liked the post yet, so add the like
      post.likes.push({ userId, name: user.name });
    }

    await post.save();
    res.status(200).json({ message: 'Post updated successfully', likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: 'Error liking post', error: error.message });
  }
};


//update user info : 
exports.UpdateUser = async (req, res, next) => {
  const { userId } = req.user; 
  const { name, email } = req.body;

  console.log('userId:', userId);
  console.log('Request body:', req.body);

  try {
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

   
    const updatedUser = await TableUser.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true } 
    );

    if (!updatedUser) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    next(error);
  }
};
// getPostLikes
exports.getPostLikes = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await TablePost.findById(postId).populate('likes.userId', 'name');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({
      likesCount: post.likes.length,
      likedUsers: post.likes.map(like => ({ userId: like.userId._id, name: like.name })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving likes', error: error.message });
  }
};
exports.getLikesCount = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await TablePost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({
      likesCount: post.likes.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving likes count', error: error.message });
  }
};


// uploadProfilePicture
exports.uploadProfilePicture = async (req, res, next) => {
  const { userId } = req.user;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

     
      const filePath = req.file.path.replace(/\\/g, '/');

   
    const updatedUser = await TableUser.findByIdAndUpdate(
      userId,
      { profilePicture: filePath },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile picture updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    next(error);
  }
};

