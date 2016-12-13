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
          vm.genRating = vm.calcGeneralRating(vm.reviews);
          vm.createChart()
        });
    };
    vm.init();
    console.log(vm)
    vm.addPut = () => {
      
      let poireview = {}
      poireview.review_content = vm.review_content
      poireview.experience_content = vm.experience_content
      poiService.addPutData(poireview)
      console.log("POIREVIEW: ", poireview)
    }
    vm.addReview = function () {
      let poireview = {}
      poireview.reviewType = 'general'
      poireview.userId = $rootScope.id
      poireview.poiId = vm.poi.id
      poireview.reviewer_name = $rootScope.name
      poireview.facebookId = $rootScope.facebookId
      poireview.review_content = vm.review_content
      poireview.rating = vm.reviewRating
      poireview.general_rating = vm.genRating
      vm.reviews.unshift(poireview)
      poiService.addReviewPoiData(poireview)

      vm.eachRatingMarkers.push(vm.reviewRating)
      vm.genRatingMarkers.push(vm.genRating)
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
        ratingNumbers.push(review.rating)
        vm.eachRatingMarkers.push(review.rating)
      })

      var ratingTotal = ratingNumbers.reduce(function (acc, review) {
        return acc + review;
      }, 0);

      vm.genRatingMarkers.push(Math.floor(ratingTotal / reviews.length))
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
