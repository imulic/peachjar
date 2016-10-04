'use strict';

/**
 * Module dependencies
 */
var programprovidersPolicy = require('../policies/programproviders.server.policy'),
  programproviders = require('../controllers/programproviders.server.controller');

module.exports = function(app) {
  // Programproviders Routes
  app.route('/api/programproviders').all(programprovidersPolicy.isAllowed)
    .get(programproviders.list)
    .post(programproviders.create);

  app.route('/api/programproviders/:programproviderId').all(programprovidersPolicy.isAllowed)
    .get(programproviders.read)
    .put(programproviders.update)
    .delete(programproviders.delete);

  // Finish by binding the Programprovider middleware
  app.param('programproviderId', programproviders.programproviderByID);
};
