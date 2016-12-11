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
          console.log(results)
          vm.genRating = vm.calcGeneralRating(vm.reviews);
        });
      console.log("THIS IS THE VM:::: ", vm)
    };
    vm.init();
    console.log(vm)
    vm.addReview = function () {
      let poireview = {}
      poireview.reviewType = 'general'
      poireview.userId = $rootScope.id
      poireview.poiId = vm.poi.id
      poireview.reviewer_name = $rootScope.name
      poireview.review_content = vm.review_content
      poireview.rating = vm.reviewRating

      vm.reviews.unshift(poireview)
      poiService.addReviewPoiData(poireview)
    }
    vm.addExperience = function () {
      let poireview = {}
      poireview.reviewType = 'general'
      poireview.userId = $rootScope.id
      poireview.poiId = vm.poi.id
      poireview.reviewer_name = $rootScope.name
      poireview.experience_content = vm.experience_content

      vm.reviews.unshift(poireview)
      poiService.addReviewPoiData(poireview)
    }

    vm.calcGeneralRating = function (reviews) {

      //to calculate the ratings, you must be logged in. Additionally, the reviews para
      //retrieves a list of review objects with a rating property
      //push numbers to array and reduce and divide by number of reviews to total average
      var ratingNumbers = [];
      var listOfRatings = reviews.forEach(function(review){
        ratingNumbers.push(review.rating)
      })

      var ratingTotal = ratingNumbers.reduce(function (acc, review) {
        return acc + review;
      }, 0);
      return Math.floor(ratingTotal / reviews.length);
    };


    vm.chart = c3.generate({
      bindto: '#chart',
      data: {
        columns: [
          ['data1', 30, 200, 100, 400, 150, 250],
          ['data2', 50, 20, 10, 40, 15, 25]
        ]
      }
    });

  }
















})();
