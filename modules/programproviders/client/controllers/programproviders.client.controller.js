(function () {
  'use strict';

  // Programproviders controller
  angular
    .module('programproviders')
    .controller('ProgramprovidersController', ProgramprovidersController);

  ProgramprovidersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'programproviderResolve',
  '$http'];

  function ProgramprovidersController ($scope, $state, $window, Authentication, programprovider,$http) {
    var vm = this;

    vm.authentication = Authentication;
    vm.programprovider = programprovider;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Getting location
    this.getLocation = function(val) {
        return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: val,
                sensor: false
            }
        }).then(function(response){
            return response.data.results.map(function(item){
                return item.formatted_address;
            });
        });
    };

    // Remove existing Programprovider
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.programprovider.$remove($state.go('programproviders.list'));
      }
    }

    // Save Programprovider
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.programproviderForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.programprovider._id) {
        vm.programprovider.$update(successCallback, errorCallback);
      } else {
        vm.programprovider.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('programproviders.view', {
          programproviderId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
