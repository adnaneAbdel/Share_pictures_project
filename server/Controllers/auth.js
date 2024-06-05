const TableUser = require('../database/user');
const TablePost = require('../database/post')
const bcrypt = require('bcrypt');
const { generateToken }  = require('../Controllers/jwt'); // Ensure the correct path to jwt


// Login function
exports.Login = async (req, res, next) => {
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
  res.status(500).json({ message: "Server error", error: error.message });
 }
}

// Register function
exports.Register = async (req, res, next) => {
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

//uploadPost function 
exports.Post = async (req, res, next) => {
  const { title , description , imageUrl} = req.body
  const userId = req.user.id;
 try {
  const post = await TablePost.create({
    userId,
    title,
    description,
    imageUrl
  })
  await post.save()
  res.status(200).json({message: "the new post added successfull",info: post})
 } catch (error) {
  res.status(400).json({ message: 'Error uploading post', error });
 }
}

//home function 
exports.Home = async (req, res , next ) => {
  try {
    const posts = await TablePost.find()
    res.status(200).json({posts})
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
}

//dashbord function 
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

//post like form user 
exports.PostLikes = async (req, res ,next ) => {
  const {postId} = req.params
  const userId = req.user.id
try {
  const user = await TableUser.findById(userId)
  const post = await TablePost.findById(postId)
  if(!post){
    res.status(400).json({message : 'post not found'})

  }
  const alreadyLiked = post.likes.some((like) => like.userId.toString() === userId);

  if (alreadyLiked) {
    return res.status(400).json({ message: 'You have already liked this post' });
  }

  post.likes.push({ userId, name: user.name });
  await post.save();
  res.status(200).json({ message: 'Post liked successfully', likes: post.likes });
} catch (error) {
  res.status(500).json({ message: 'Error liking post', error: error.message });
}
}