'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * District Schema
 */
var DistrictSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill District name',
    trim: true
  },
  state : {
    type:String,
    default:'CA',
    required:'Please fill District State',
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

mongoose.model('District', DistrictSchema);
