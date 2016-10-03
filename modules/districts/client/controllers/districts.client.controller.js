(function () {
  'use strict';

  // Districts controller
  angular
    .module('districts')
    .controller('DistrictsController', DistrictsController);

  DistrictsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'districtResolve',
  '$http'];

  function DistrictsController ($scope, $state, $window, Authentication, district,$http) {
    var vm = this;

    vm.authentication = Authentication;
    vm.district = district;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

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

    // Remove existing District
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.district.$remove($state.go('districts.list'));
      }
    }

    // Save District
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.districtForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.district._id) {
        vm.district.$update(successCallback, errorCallback);
      } else {
        vm.district.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('districts.view', {
          districtId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
