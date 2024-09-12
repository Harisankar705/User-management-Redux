const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileUrl:{
    type:String,
  },
  isActive:{
    type:Boolean,
    default:true
  },
  profilePicture: String,
});

module.exports = mongoose.model("user", userSchema);
