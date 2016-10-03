(function () {
  'use strict';

  angular
    .module('schools')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('schools', {
        abstract: true,
        url: '/schools',
        template: '<ui-view/>'
      })
      .state('schools.list', {
        url: '',
        templateUrl: 'modules/schools/client/views/list-schools.client.view.html',
        controller: 'SchoolsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Schools List'
        }
      })
      .state('schools.create', {
        url: '/create',
        templateUrl: 'modules/schools/client/views/form-school.client.view.html',
        controller: 'SchoolsController',
        controllerAs: 'vm',
        resolve: {
          schoolResolve: newSchool
        },
        data: {
          roles: ['user', 'admin','district'],
          pageTitle: 'Schools Create'
        }
      })
      .state('schools.edit', {
        url: '/:schoolId/edit',
        templateUrl: 'modules/schools/client/views/form-school.client.view.html',
        controller: 'SchoolsController',
        controllerAs: 'vm',
        resolve: {
          schoolResolve: getSchool
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit School {{ schoolResolve.name }}'
        }
      })
      .state('schools.view', {
        url: '/:schoolId',
        templateUrl: 'modules/schools/client/views/view-school.client.view.html',
        controller: 'SchoolsController',
        controllerAs: 'vm',
        resolve: {
          schoolResolve: getSchool
        },
        data: {
          pageTitle: 'School {{ schoolResolve.name }}'
        }
      });
  }

  getSchool.$inject = ['$stateParams', 'SchoolsService'];

  function getSchool($stateParams, SchoolsService) {
    return SchoolsService.get({
      schoolId: $stateParams.schoolId
    }).$promise;
  }

  newSchool.$inject = ['SchoolsService'];

  function newSchool(SchoolsService) {
    return new SchoolsService();
  }
}());
