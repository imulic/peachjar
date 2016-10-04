'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Programprovider Schema
 */
var ProgramproviderSchema = new Schema({
  
  name: {
    type: String,
    default: '',
    required: 'Please fill Program Provider name',
    trim: true
  },

  address : {
    type: String,
    required: 'Please provide the address',
    trim:true
  },

  pdf_disclaimer_required : {
    type:Boolean,
    default : false
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

mongoose.model('Programprovider', ProgramproviderSchema);
