(function () {
  'use strict';

  angular
    .module('districts')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Districts',
      state: 'districts',
      type: 'dropdown',
      roles: ['admin','district']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'districts', {
      title: 'List Districts',
      state: 'districts.list',
      roles : ['admin','district']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'districts', {
      title: 'Create District',
      state: 'districts.create',
      roles: ['admin','district']
    });
  }
}());
