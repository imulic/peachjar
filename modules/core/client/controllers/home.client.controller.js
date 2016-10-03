'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    // Some example string
    $scope.helloText = 'Welcome in PeachJar Application Interface';
    $scope.descriptionText = 'It is an application skeleton for our web-app. We can use it to quickly bootstrap our project.';

  }
]);
