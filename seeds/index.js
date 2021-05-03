const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');


// we are connecting yelp camp database to the mongo db which is running locally on our machine
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology : true

});

//checking that  our node application is connected to the database succesfully
// via mongoose our application is connected to the database
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>{
    console.log("Database connected")
})

// function to return the random number betweeen the array length
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// seedDB function 
const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i = 0; i<300; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20 ) + 10;

        const camp = new Campground({
            author : '601d3f18211669573a63f816',
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            description : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit fugiat, qui quisquam quas aliquid illo eos amet beatae quidem, eius et consequatur itaque aut totam enim debitis! Vero, nisi tenetur',
            price : price,
            geometry : {
                type : "Point",
                coordinates : [cities[random1000].longitude,cities[random1000].latitude]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dri2tqsrc/image/upload/v1612828715/YelpCamp/ewdnfjck0kvei7kzswdh.png',
                  filename: 'YelpCamp/ewdnfjck0kvei7kzswdh'
                }
              ]

        })
       await camp.save();
    }
    
}

seedDB().then(() => {
    mongoose.connection.close();
})