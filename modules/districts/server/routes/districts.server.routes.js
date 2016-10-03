'use strict';

/**
 * Module dependencies
 */
var districtsPolicy = require('../policies/districts.server.policy'),
  districts = require('../controllers/districts.server.controller');

module.exports = function(app) {
  // Districts Routes
  app.route('/api/districts').all(districtsPolicy.isAllowed)
    .get(districts.list)
    .post(districts.create);

  app.route('/api/districts/:districtId').all(districtsPolicy.isAllowed)
    .get(districts.read)
    .put(districts.update)
    .delete(districts.delete);

  // Finish by binding the District middleware
  app.param('districtId', districts.districtByID);
};
