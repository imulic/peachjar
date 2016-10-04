// Programproviders service used to communicate Programproviders REST endpoints
(function () {
  'use strict';

  angular
    .module('programproviders')
    .factory('ProgramprovidersService', ProgramprovidersService);

  ProgramprovidersService.$inject = ['$resource'];

  function ProgramprovidersService($resource) {
    return $resource('api/programproviders/:programproviderId', {
      programproviderId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
