(function () {

  angular
    .module('blockApp')
    .controller('homeCtrl', homeCtrl);

  homeCtrl.$inject = ['$scope', 'blockData'];
  function homeCtrl ($scope, blockData) {
    
    var vm = this;

    vm.pageHeader = {
      title: 'Blog',
      strapline: 'winter is comming'
    };
    
    vm.message = "Buscando Blogs";

    blockData.locationByCoords()
            .success(function(data) {
                vm.message = data.length > 0 ? "" : "No blocks found nearby";
                vm.data = { blocks: data };
            })
            .error(function (e) {
                vm.message = "Sorry, ocurrio un error";
            });
  };

})();