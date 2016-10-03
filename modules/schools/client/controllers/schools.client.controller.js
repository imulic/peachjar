(function () {
  'use strict';

  // Schools controller
  angular
    .module('schools')
    .controller('SchoolsController', SchoolsController);

  SchoolsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'schoolResolve','DistrictsService', '$log', '$http'];

  function SchoolsController ($scope, $state, $window, Authentication, school, districtsService, $log, $http) {
    var vm = this;

    vm.authentication = Authentication;
    vm.school = school;
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

    vm.current_district_id = vm.school.district_id;

    // Populate districts by invoking a districts service
    $scope.findDistricts = function () {
          vm.availableDistricts = districtsService.query();
    };

    $scope.findDistricts();

    // Remove existing School
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.school.$remove($state.go('schools.list'));
      }
    }

    // Save School
    function save(isValid) {
      
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.schoolForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.school._id) {
        vm.school.$update(successCallback, errorCallback);
      } else {
        vm.school.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('schools.view', {
          schoolId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
