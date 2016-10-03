// Flyers service used to communicate Flyers REST endpoints
(function () {
  'use strict';

  angular
    .module('flyers')
    .factory('FlyersService', FlyersService);

  FlyersService.$inject = ['$resource'];

  function FlyersService($resource) {
    return $resource('api/flyers/:flyerId', {
      flyerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
