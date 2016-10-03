// Districts service used to communicate Districts REST endpoints
(function () {
  'use strict';

  angular
    .module('districts')
    .factory('DistrictsService', DistrictsService);

  DistrictsService.$inject = ['$resource'];

  function DistrictsService($resource) {
    return $resource('api/districts/:districtId', {
      districtId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
