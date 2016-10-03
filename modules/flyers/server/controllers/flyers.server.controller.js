'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Flyer = mongoose.model('Flyer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Flyer
 */
exports.create = function(req, res) {
  var flyer = new Flyer(req.body);
  flyer.user = req.user;

  flyer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(flyer);
    }
  });
};

/**
 * Show the current Flyer
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var flyer = req.flyer ? req.flyer.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  flyer.isCurrentUserOwner = req.user && flyer.user && flyer.user._id.toString() === req.user._id.toString();

  res.jsonp(flyer);
};

/**
 * Update a Flyer
 */
exports.update = function(req, res) {
  var flyer = req.flyer;

  flyer = _.extend(flyer, req.body);

  flyer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(flyer);
    }
  });
};

/**
 * Delete an Flyer
 */
exports.delete = function(req, res) {
  var flyer = req.flyer;

  flyer.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(flyer);
    }
  });
};

/**
 * List of Flyers
 */
exports.list = function(req, res) {
  Flyer.find().sort('-created').populate('user', 'displayName').exec(function(err, flyers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(flyers);
    }
  });
};

/**
 * Flyer middleware
 */
exports.flyerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Flyer is invalid'
    });
  }

  Flyer.findById(id).populate('user', 'displayName').exec(function (err, flyer) {
    if (err) {
      return next(err);
    } else if (!flyer) {
      return res.status(404).send({
        message: 'No Flyer with that identifier has been found'
      });
    }
    req.flyer = flyer;
    next();
  });
};
