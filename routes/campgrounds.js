const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');
const campgrounds = require('../controllers/campgrounds');
const {campgroundSchema, reviewSchema} = require('../schemas');
const {isLoggedIn,validationCampground,isAuthor} = require('../middleware');
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage});


router.route('/')
  .get( catchAsync(campgrounds.index))
  .post( isLoggedIn,upload.array('image'), validationCampground, catchAsync(campgrounds.createCampground))



  // new and create a campground
router.get('/new', isLoggedIn ,campgrounds.renderNewForm);

router.route('/:id')
.get(catchAsync(campgrounds.showCampground))
// we are just uploading the images under the key in the form data named image
// we need to add input image to the form data
.put(isLoggedIn,isAuthor,upload.array('image'), validationCampground, catchAsync(campgrounds.updateCampground))
.delete(isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground))


router.get('/:id/edit', isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));

module.exports = router;
