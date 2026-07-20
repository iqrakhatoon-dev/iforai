const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "username already taken"],
    required: [true, "this field is required"],
  },
  email: {
    type: String,
    unique: [true, "Account is already exists with this email address/"],
    required: [true, "this field is required"],
  },
  password: {
    type: String,
    required: [true, "this field is required"],
  },
});

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
