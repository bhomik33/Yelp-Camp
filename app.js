if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
console.log(process.env.Secret)
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');

const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const {campgroundSchema, reviewSchema} = require('./schemas');
const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');
const mongoSanitize = require('express-mongo-sanitize');





// requiring passport which allows us to plugin multiple strategies
const passport = require('passport');
// requiring Local strategy module of passport which lets us to authenticate with username and password
const LocalStrategy = require('passport-local');
// requiring user model
const User = require('./models/user');

// importing the routes in the app
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const { serializeUser } = require('passport');


// we are connecting yelp camp database to the mongo db which is running locally on our machine
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    // configuration to avoid the depreciation warnings
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify : false

});




//checking that  our node application is connected to the database succesfully
// via mongoose our application is connected to the database
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
})


// executing  the express to use the express methods 
const app = express();



// setting the view engine to ejs
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'))

//serving the static files like additional css and js files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(mongoSanitize());


const sessionConfig = {
    secret : 'thisshouldbeabettersecret',
    resave : false,
    saveUninitialized : true,    
    cookie : {
        httpOnly : true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

//using these middlewares to initialize passport
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
// stroing the user in the session
passport.serializeUser(User.serializeUser());
//unstoring the user from the session
passport.deserializeUser(User.deserializeUser());


app.use((req,res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

// http get request method
// getting the data from the server
app.get('/', (req, res) => {
    res.render('home')
})





app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not found!', 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no!, something went wrong';
    res.status(statusCode).render('error', { error: err });
})


//start up a server on port 3000
app.listen(8080, () => {
    console.log("Serving on port 3000")
})

