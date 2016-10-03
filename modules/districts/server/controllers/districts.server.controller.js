'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  District = mongoose.model('District'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a District
 */
exports.create = function(req, res) {
  var district = new District(req.body);
  district.user = req.user;

  district.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(district);
    }
  });
};

/**
 * Show the current District
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var district = req.district ? req.district.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  district.isCurrentUserOwner = req.user && district.user && district.user._id.toString() === req.user._id.toString();

  res.jsonp(district);
};

/**
 * Update a District
 */
exports.update = function(req, res) {
  var district = req.district;

  district = _.extend(district, req.body);

  district.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(district);
    }
  });
};

/**
 * Delete an District
 */
exports.delete = function(req, res) {
  var district = req.district;

  district.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(district);
    }
  });
};

/**
 * List of Districts
 */
exports.list = function(req, res) {
  District.find().sort('-created').populate('user', 'displayName').exec(function(err, districts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(districts);
    }
  });
};

/**
 * District middleware
 */
exports.districtByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'District is invalid'
    });
  }

  District.findById(id).populate('user', 'displayName').exec(function (err, district) {
    if (err) {
      return next(err);
    } else if (!district) {
      return res.status(404).send({
        message: 'No District with that identifier has been found'
      });
    }
    req.district = district;
    next();
  });
};
