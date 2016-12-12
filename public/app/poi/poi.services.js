(function () {
  'use strict';
  angular
    .module('point-blank.search')
    .factory('poiService', poiService);

  poiService.$inject = ['$http'];

  function poiService ($http) {
    var addReviewPoiData = function (poireview) {
      console.log(poireview)
      return $http({
        method: 'POST',
        url: '/api/review',
        data: poireview
      })
      .then(function (results) {
        document.querySelector('.mdl-textfield__input').value = ''
        document.querySelector('.mdl-textfield__input2').value = ''
        console.log(results)
        return results;
      });
    };

    var grabSinglePoiData = function (poiInfo) {
      return $http({
        method: 'GET',
        url: '/api/poi/' + poiInfo,
        headers: {'Content-Type': 'application/json'},
        data: {'name': 'poiInfo'}
      })
      .then(function (results) {
        console.log("These are the results data from grabbing a single POI data: ", results.data)
        return results.data;
      });
    };

    return {
      addReviewPoiData: addReviewPoiData,
      grabSinglePoiData: grabSinglePoiData
    };
  }


})();
