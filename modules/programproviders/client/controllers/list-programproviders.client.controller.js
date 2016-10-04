(function () {
  'use strict';

  angular
    .module('programproviders')
    .controller('ProgramprovidersListController', ProgramprovidersListController);

  ProgramprovidersListController.$inject = ['ProgramprovidersService'];

  function ProgramprovidersListController(ProgramprovidersService) {
    var vm = this;

    vm.programproviders = ProgramprovidersService.query();
  }
}());
