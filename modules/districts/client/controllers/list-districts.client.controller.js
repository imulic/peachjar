(function () {
  'use strict';

  angular
    .module('districts')
    .controller('DistrictsListController', DistrictsListController);

  DistrictsListController.$inject = ['DistrictsService'];

  function DistrictsListController(DistrictsService) {
    var vm = this;

    vm.districts = DistrictsService.query();
  }
}());
