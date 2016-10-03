(function () {
  'use strict';

  angular
    .module('flyers')
    .controller('FlyersListController', FlyersListController);

  FlyersListController.$inject = ['FlyersService'];

  function FlyersListController(FlyersService) {
    var vm = this;

    vm.flyers = FlyersService.query();
  }
}());
