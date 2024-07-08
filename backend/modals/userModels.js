const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userModel = mongoose.Schema({
    name: String,
    email: String,
    isAdmin: Boolean,
    password: String
},{
    timeStamp: true
})

const User = mongoose.model('User',userModel);

module.exports =  User