const mongoose = require('mongoose')

const TablePost = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    imageUrl:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date, 
        default: Date.now 
    },
    likes: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
          },
          name: {
            type: String,
            required: true
          }
        }
      ]
})
TablePost.methods.stringifyId = function() {
    return this._id.toString();
  };

const modelPost = mongoose.model('Post', TablePost)

module.exports = modelPost ;