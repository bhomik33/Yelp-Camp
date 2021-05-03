const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema( {
    email : {
       type : String,
       required : true,
       // every  user must have a unique email
       unique : true
    }
})
// passing in the passportLocalMongoose in userSchema.plugin()
//this is just a add on for username and password in userSchema
UserSchema.plugin(passportLocalMongoose);

// exporting the model
module.exports = mongoose.model('User', UserSchema);
