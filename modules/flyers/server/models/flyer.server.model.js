'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Flyer Schema
 */
var FlyerSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Flyer name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Flyer', FlyerSchema);
