(function () {
  'use strict';

  angular
    .module('flyers')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Flyers',
      state: 'flyers',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'flyers', {
      title: 'List Flyers',
      state: 'flyers.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'flyers', {
      title: 'Create Flyer',
      state: 'flyers.create',
      roles: ['user']
    });
  }
}());
