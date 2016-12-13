(function () {
  'use strict';

  angular
    .module('point-blank.search')
    .controller('search-controller', SearchController);

  SearchController.$inject = ['$location', '$state', 'searchService'];

  function SearchController ($location, $state, searchService) {
    var vm = this;

    // this variable is being used on the search.template page to load up poi data, the actual variable is declared in the promise from the page initialization
    vm.poiList;

    // this init function is initializing the page on pageload, it invokes a function inside the searchService that will fire off a request to the server for all the poi data
    vm.init = function () {
      searchService.getInitData()
      .then(function (results) {
        //console.log(results)
        vm.poiList = results;
        results.forEach(function(poi){
          console.log(poi.general_rating)
          if (poi.general_rating < 80 || poi.general_rating === null){
            vm.badRatings.push(poi.general_rating)
          }
          else{
            vm.goodRatings.push(poi.general_rating)
          }
        })
        vm.createChart()
      });
    };
    vm.goodRatings = ['% POI']
    vm.badRatings = ['% POS']
    vm.nulls = []
    vm.init();

    // this function is used for the POS filtering, it evaluates whether the general POI rating is less than 40, returning true or false
    vm.isPOS = function (poi) {
      return poi.general_rating < 40;
    };

    // this function does a path redirect to the POI page when a user clicks on their icon
    vm.getPOI = function (poiInfo) {
      return $location.path('/poi/' + poiInfo);
    };


    vm.createChart = function() {
      c3.generate({
        bindto: '#donutChart',
        data: {
          columns: [
              vm.goodRatings,
              vm.badRatings
          ],
          type : 'donut'
        },
        donut: {
            title: "Average Rating"
        }
      });
    }

  }

})();
