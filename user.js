const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    first_name : String,
    last_name : String,
    age : Number,
    gender: String,
    password: String
},{
    collation : "User"
});

module.exports = mongoose.model('User', userSchema);