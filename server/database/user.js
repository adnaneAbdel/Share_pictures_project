const mongoose = require('mongoose')

const TableUser = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
})
TableUser.methods.stringifyId = function() {
    return this._id.toString();
  };

const modelUser = mongoose.model('User', TableUser)

module.exports = modelUser ;