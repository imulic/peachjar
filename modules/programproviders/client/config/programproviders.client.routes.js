(function () {
  'use strict';

  angular
    .module('programproviders')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('programproviders', {
        abstract: true,
        url: '/programproviders',
        template: '<ui-view/>'
      })
      .state('programproviders.list', {
        url: '',
        templateUrl: 'modules/programproviders/client/views/list-programproviders.client.view.html',
        controller: 'ProgramprovidersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Programproviders List'
        }
      })
      .state('programproviders.create', {
        url: '/create',
        templateUrl: 'modules/programproviders/client/views/form-programprovider.client.view.html',
        controller: 'ProgramprovidersController',
        controllerAs: 'vm',
        resolve: {
          programproviderResolve: newProgramprovider
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Programproviders Create'
        }
      })
      .state('programproviders.edit', {
        url: '/:programproviderId/edit',
        templateUrl: 'modules/programproviders/client/views/form-programprovider.client.view.html',
        controller: 'ProgramprovidersController',
        controllerAs: 'vm',
        resolve: {
          programproviderResolve: getProgramprovider
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Programprovider {{ programproviderResolve.name }}'
        }
      })
      .state('programproviders.view', {
        url: '/:programproviderId',
        templateUrl: 'modules/programproviders/client/views/view-programprovider.client.view.html',
        controller: 'ProgramprovidersController',
        controllerAs: 'vm',
        resolve: {
          programproviderResolve: getProgramprovider
        },
        data: {
          pageTitle: 'Programprovider {{ programproviderResolve.name }}'
        }
      });
  }

  getProgramprovider.$inject = ['$stateParams', 'ProgramprovidersService'];

  function getProgramprovider($stateParams, ProgramprovidersService) {
    return ProgramprovidersService.get({
      programproviderId: $stateParams.programproviderId
    }).$promise;
  }

  newProgramprovider.$inject = ['ProgramprovidersService'];

  function newProgramprovider(ProgramprovidersService) {
    return new ProgramprovidersService();
  }
}());
