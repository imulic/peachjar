(function () {
  'use strict';

  angular
    .module('flyers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('flyers', {
        abstract: true,
        url: '/flyers',
        template: '<ui-view/>'
      })
      .state('flyers.list', {
        url: '',
        templateUrl: 'modules/flyers/client/views/list-flyers.client.view.html',
        controller: 'FlyersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Flyers List'
        }
      })
      .state('flyers.create', {
        url: '/create',
        templateUrl: 'modules/flyers/client/views/form-flyer.client.view.html',
        controller: 'FlyersController',
        controllerAs: 'vm',
        resolve: {
          flyerResolve: newFlyer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Flyers Create'
        }
      })
      .state('flyers.edit', {
        url: '/:flyerId/edit',
        templateUrl: 'modules/flyers/client/views/form-flyer.client.view.html',
        controller: 'FlyersController',
        controllerAs: 'vm',
        resolve: {
          flyerResolve: getFlyer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Flyer {{ flyerResolve.name }}'
        }
      })
      .state('flyers.view', {
        url: '/:flyerId',
        templateUrl: 'modules/flyers/client/views/view-flyer.client.view.html',
        controller: 'FlyersController',
        controllerAs: 'vm',
        resolve: {
          flyerResolve: getFlyer
        },
        data: {
          pageTitle: 'Flyer {{ flyerResolve.name }}'
        }
      });
  }

  getFlyer.$inject = ['$stateParams', 'FlyersService'];

  function getFlyer($stateParams, FlyersService) {
    return FlyersService.get({
      flyerId: $stateParams.flyerId
    }).$promise;
  }

  newFlyer.$inject = ['FlyersService'];

  function newFlyer(FlyersService) {
    return new FlyersService();
  }
}());
