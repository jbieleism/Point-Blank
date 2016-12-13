(function () {
  'use strict'

  angular
    .module('point-blank.poi')
    .controller('poi-controller', PoiController)

  PoiController.$inject = ['$location', '$state', 'poiService', '$rootScope']

  function PoiController ($location, $state, poiService, $rootScope) {
    var vm = this
    vm.poi
    vm.reviews
    vm.data = {}
    vm.reviewRating = 50
    vm.genRating
    vm.expReviewToggle = true

    vm.init = function () {
      var url = $location.$$url
      url = url.slice(5).split('%20').join(' ')
      poiService.grabSinglePoiData(url)
        .then(function (results) {
          vm.poi = results;
          vm.reviews = results.reviews;
          vm.genRating = vm.calcGeneralRating(vm.reviews) || 0;
          vm.createChart()
        });
    };
    vm.init();
    vm.addReview = function () {

      if (vm.genRating === 0){
        vm.genRating = vm.reviewRating
      }

      vm.eachRatingMarkers = ['Individual Rating']
      vm.genRatingMarkers = ['General Rating']

      console.log(vm.reviews)
      let poireview = {}
      poireview.reviewType = 'general'
      poireview.userId = $rootScope.id
      poireview.poiId = vm.poi.id
      poireview.reviewer_name = $rootScope.name
      poireview.facebookId = $rootScope.facebookId
      poireview.review_content = vm.review_content
      poireview.rating = vm.reviewRating
      poireview.general_rating = vm.genRating
      vm.reviews.push(poireview)

      vm.genRating = vm.calcGeneralRating(vm.reviews)

      poiService.addReviewPoiData(poireview)




      //console.log(vm.genRating)
      vm.createChart()
    }
    vm.addExperience = function () {
      let poireview = {}
      poireview.userId = $rootScope.id
      poireview.poiId = vm.poi.id
      poireview.reviewer_name = $rootScope.name
      poireview.facebookId = $rootScope.facebookId
      poireview.experience_content = vm.experience_content

      vm.reviews.unshift(poireview)
      poiService.addReviewPoiData(poireview)
    }

    vm.calcGeneralRating = function (reviews) {
      // to calculate the ratings, you must be logged in. Additionally, the reviews para
      // retrieves a list of review objects with a rating property
      // push numbers to array and reduce and divide by number of reviews to total average
      var ratingNumbers = []
      var listOfRatings = reviews.forEach(function (review) {
        ratingNumbers.push(parseInt(review.rating))
        vm.eachRatingMarkers.push(review.rating)
        vm.genRatingMarkers.push(review.general_rating)
      })

      var ratingTotal = ratingNumbers.reduce(function (acc, review) {
        return acc + review;
      }, 0);

      vm.genRatingMarkers.push(Math.floor(ratingTotal/ratingNumbers.length))
      return Math.floor(ratingTotal / reviews.length);
    };

    vm.plotGenRating = function() {
      console.log(vm.calGeneralRating())
    }

    vm.eachRatingMarkers = ['Individual Rating']
    vm.genRatingMarkers = ['General Rating']

    vm.createChart = function() {
      c3.generate({
        bindto: '#chart',
        data: {
          columns: [
            vm.eachRatingMarkers,
            vm.genRatingMarkers
          ],
          types:{
            'General Rating': 'area'
          }
        },
        axis: {
          y: {
            max: 100,
            min: 10
          }
        },
        grid: {
          y: {
            lines: [
              {value: 40, text: 'POS Threshold', area: 'red'}
            ]
          },
          types:{
            y: 'area'
          }
        }
      });
    }


  }
})()
