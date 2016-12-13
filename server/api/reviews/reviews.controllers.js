require('../../config/db.config.js');
const Review = require('./reviews.model.js');
const POI = require('../poi/poi.model');
exports.getAllReviews = function (req, res) {
  Review.findAll()
    .then(function (review) {
      res.status(200).json(review);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

exports.getOneReviewByName = function (req, res) {
  const reviewId = req.params.id;
  Review.findOne({ where: {name: reviewId} })
    .then(function (review) {
      res.status(200).json(review);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

exports.addOneReview = function (req, res) {
  const reviewType = req.body.reviewType; // MUST BE 'general' OR 'personal'
  const reviewContent = req.body.review_content;
  const rating = req.body.rating || 10;
  const userId = req.body.userId;
  const poiId = req.body.poiId;
  const reviewerName = req.body.reviewer_name;
  const experienceContent = req.body.experience_content;
  const facebookId = req.body.facebookId;


  Review.create({
    review_type: reviewType,
    review_content: reviewContent,
    rating: rating,
    userId: userId,
    poiId: poiId,
    reviewer_name: reviewerName,
    experience_content: experienceContent,
    facebookId: facebookId

  })
    .then(function (savedReview) {
      // get all the review ratings

      Review.findAll({})
        .then((reviews) => {
          let ratings = reviews.map((review) => {
            return review.rating;
          })
          let average = ratings.reduce((acc, reviewNum) => {
            return acc + reviewNum
          }, 0) / ratings.length
          return average
        })
        .then((averageRating) => {
          POI.update(
            {
              general_rating: averageRating
            },
            {
              where: {
                id: savedReview.poiId
              }
            }
          )
          res.status(201).json(savedReview);
        })

    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};
