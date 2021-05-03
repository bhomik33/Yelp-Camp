const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// this is our review Schema
const reviewSchema = new Schema ({
    body : String,
    rating : Number,
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
});

// compiling our review model
module.exports= mongoose.model('Review' , reviewSchema);

