(function () {
  'use strict';
  angular
    .module('point-blank.search')
    .factory('poiService', poiService);

  poiService.$inject = ['$http'];

  function poiService ($http) {
    var addReviewPoiData = function (poireview) {
      return $http({
        method: 'POST',
        url: '/api/review',
        data: poireview
      })
      .then(function (results) {
        document.querySelector('.mdl-textfield__input').value = ''
        document.querySelector('.mdl-textfield__input2').value = ''
        return results;
      });
    };

    let addPutData = (poireview) => {
      return $http({
        method: 'PUT',
        url: '/api/review',
        data: poireview

      })
      .then((results) => {
        return results
      })
    }

    var grabSinglePoiData = function (poiInfo) {
      return $http({
        method: 'GET',
        url: '/api/poi/' + poiInfo,
        headers: {'Content-Type': 'application/json'},
        data: {'name': 'poiInfo'}
      })
      .then(function (results) {
        return results.data;
      });
    };

    return {
      addReviewPoiData: addReviewPoiData,
      grabSinglePoiData: grabSinglePoiData
    };
  }


})();
