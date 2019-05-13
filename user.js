const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    name : String,
    age : Number,
    gender : String,
    title : String,
    start_date : String
},{
    collation : "User"
});

module.exports = mongoose.model('User', userSchema);