'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('lodash');

var schemaOptions = {
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
};

var ScoreSchema = new Schema({
	valueB: {
		type: Schema.Types.String
	},
	score: {
		type: Schema.Types.Number
	}
}, schemaOptions);

mongoose.model('Score', ScoreSchema);

module.exports = ScoreSchema;
