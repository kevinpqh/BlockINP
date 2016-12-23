(function() {

  angular
    .module('blockApp')
    .service('blockData', blockData);

  blockData.$inject = ['$http'];
  function blockData ($http) {
    var locationByCoords = function () {
      return $http.get('/api/block');
    };

    var locationById = function (blockid) {
      return $http.get('/api/block/' + blockid);
    };

    /*var addReviewById = function (locationid, data) {
      return $http.post('/api/locations/' + locationid + '/reviews', data);
    };*/

    return {
      locationByCoords : locationByCoords,
      locationById : locationById/*
      addReviewById : addReviewById*/
    };
  }

})();