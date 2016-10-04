'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Programprovider = mongoose.model('Programprovider'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Programprovider
 */
exports.create = function(req, res) {
  var programprovider = new Programprovider(req.body);
  programprovider.user = req.user;

  programprovider.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(programprovider);
    }
  });
};

/**
 * Show the current Programprovider
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var programprovider = req.programprovider ? req.programprovider.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  programprovider.isCurrentUserOwner = req.user && programprovider.user && programprovider.user._id.toString() === req.user._id.toString();

  res.jsonp(programprovider);
};

/**
 * Update a Programprovider
 */
exports.update = function(req, res) {
  var programprovider = req.programprovider;

  programprovider = _.extend(programprovider, req.body);

  programprovider.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(programprovider);
    }
  });
};

/**
 * Delete an Programprovider
 */
exports.delete = function(req, res) {
  var programprovider = req.programprovider;

  programprovider.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(programprovider);
    }
  });
};

/**
 * List of Programproviders
 */
exports.list = function(req, res) {
  Programprovider.find().sort('-created').populate('user', 'displayName').exec(function(err, programproviders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(programproviders);
    }
  });
};

/**
 * Programprovider middleware
 */
exports.programproviderByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Programprovider is invalid'
    });
  }

  Programprovider.findById(id).populate('user', 'displayName').exec(function (err, programprovider) {
    if (err) {
      return next(err);
    } else if (!programprovider) {
      return res.status(404).send({
        message: 'No Programprovider with that identifier has been found'
      });
    }
    req.programprovider = programprovider;
    next();
  });
};
