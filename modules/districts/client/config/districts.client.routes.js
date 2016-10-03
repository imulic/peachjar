(function () {
  'use strict';

  angular
    .module('districts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('districts', {
        abstract: true,
        url: '/districts',
        template: '<ui-view/>'
      })
      .state('districts.list', {
        url: '',
        templateUrl: 'modules/districts/client/views/list-districts.client.view.html',
        controller: 'DistrictsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Districts List'
        }
      })
      .state('districts.create', {
        url: '/create',
        templateUrl: 'modules/districts/client/views/form-district.client.view.html',
        controller: 'DistrictsController',
        controllerAs: 'vm',
        resolve: {
          districtResolve: newDistrict
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Districts Create'
        }
      })
      .state('districts.edit', {
        url: '/:districtId/edit',
        templateUrl: 'modules/districts/client/views/form-district.client.view.html',
        controller: 'DistrictsController',
        controllerAs: 'vm',
        resolve: {
          districtResolve: getDistrict
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit District {{ districtResolve.name }}'
        }
      })
      .state('districts.view', {
        url: '/:districtId',
        templateUrl: 'modules/districts/client/views/view-district.client.view.html',
        controller: 'DistrictsController',
        controllerAs: 'vm',
        resolve: {
          districtResolve: getDistrict
        },
        data: {
          pageTitle: 'District {{ districtResolve.name }}'
        }
      });
  }

  getDistrict.$inject = ['$stateParams', 'DistrictsService'];

  function getDistrict($stateParams, DistrictsService) {
    return DistrictsService.get({
      districtId: $stateParams.districtId
    }).$promise;
  }

  newDistrict.$inject = ['DistrictsService'];

  function newDistrict(DistrictsService) {
    return new DistrictsService();
  }
}());
