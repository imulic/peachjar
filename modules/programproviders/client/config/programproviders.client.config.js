(function () {
  'use strict';

  angular
    .module('programproviders')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Programproviders',
      state: 'programproviders',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'programproviders', {
      title: 'List Program Providers',
      state: 'programproviders.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'programproviders', {
      title: 'Create Program Provider',
      state: 'programproviders.create',
      roles: ['admin']
    });
  }
}());
