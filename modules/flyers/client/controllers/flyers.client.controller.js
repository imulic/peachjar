(function () {
  'use strict';

  // Flyers controller
  angular
    .module('flyers')
    .controller('FlyersController', FlyersController);

  FlyersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'flyerResolve'];

  function FlyersController ($scope, $state, $window, Authentication, flyer) {
    var vm = this;

    vm.authentication = Authentication;
    vm.flyer = flyer;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Flyer
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.flyer.$remove($state.go('flyers.list'));
      }
    }

    // Save Flyer
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.flyerForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.flyer._id) {
        vm.flyer.$update(successCallback, errorCallback);
      } else {
        vm.flyer.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('flyers.view', {
          flyerId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
