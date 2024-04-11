const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type:String, required:true},
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String }
})

const userModel = new mongoose.model("UserModel", userSchema);

module.exports = userModel;