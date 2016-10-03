'use strict';

/**
 * Module dependencies
 */
var flyersPolicy = require('../policies/flyers.server.policy'),
  flyers = require('../controllers/flyers.server.controller');

module.exports = function(app) {
  // Flyers Routes
  app.route('/api/flyers').all(flyersPolicy.isAllowed)
    .get(flyers.list)
    .post(flyers.create);

  app.route('/api/flyers/:flyerId').all(flyersPolicy.isAllowed)
    .get(flyers.read)
    .put(flyers.update)
    .delete(flyers.delete);

  // Finish by binding the Flyer middleware
  app.param('flyerId', flyers.flyerByID);
};
