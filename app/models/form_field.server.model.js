'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	util = require('util'),
	timeStampPlugin = require('../libs/timestamp.server.plugin'),
	_ = require('lodash'),
	Schema = mongoose.Schema,
	LogicJumpSchema = require('./logic_jump.server.model'),
	ScoreSchema = require('./score.server.model'),
	tokgen = require('../libs/tokenGenerator');

var FieldOptionSchema = new Schema({
	option_id: {
		type: Number
	},

	option_title: {
		type: String
	},

	option_value: {
		type: String,
		trim: true
	},
	option_image:
	{
		type: String
	}
});

var RatingFieldSchema = new Schema({
	steps: {
		type: Number,
		min: 1,
		max: 10
	},
	shape: {
		type: String,
		enum: [
			'Heart',
			'Star',
			'thumbs-up',
			'thumbs-down',
			'Circle',
			'Square',
			'Check Circle',
			'Smile Outlined',
			'Hourglass',
			'bell',
			'Paper Plane',
			'Comment',
			'Trash'
		]
	},
	validShapes: {
		type: [String]
	}
});

/**
 * FormField Schema
 */
function BaseFieldSchema(){
	Schema.apply(this, arguments);

	this.add({
		globalId: {
			type: String,
    	},
		isSubmission: {
			type: Boolean,
			default: false
		},
		submissionId: {
			type: Schema.Types.ObjectId
		},
		title: {
			type: String,
			trim: true
		},
		description: {
			type: String,
			default: ''
		},

		logicJump: [LogicJumpSchema],
		variable: 
		{
			type: String,
			default:null
		},
		ratingOptions: RatingFieldSchema,
		fieldOptions: [FieldOptionSchema],
		required: {
			type: Boolean,
			default: true
		},
		disabled: {
			type: Boolean,
			default: false
		},

		variable : {
			type: String,
		},

		deletePreserved: {
			type: Boolean,
			default: false
		},
		showOnJump: {
			type: Boolean,
			default: false
		},
		score: [ScoreSchema],

		validFieldTypes: {
			type: [String]
		},
		fieldType: {
			type: String,
			enum: [
				'textfield',
				'date',
				'email',
				'link',
				'legal',
				'plate',
				'phone',
				'url',
				'textarea',
				'statement',
				'welcome',
				'thankyou',
				'file',
				'dropdown',
				'scale',
				'rating',
				'radio',
				'checkbox',
				'hidden',
				'yes_no',
				'natural',
				'stripe',
				'number'
			]
		},
		fieldValue: Schema.Types.Mixed
	});

	this.plugin(timeStampPlugin, {
		createdPath: 'created',
		modifiedPath: 'lastModified',
		useVirtual: false
	});

	this.pre('save', function (next) {
		this.validFieldTypes = mongoose.model('Field').schema.path('fieldType').enumValues;

		if(this.fieldType === 'rating' && this.ratingOptions.validShapes.length === 0){
			this.ratingOptions.validShapes = mongoose.model('RatingOptions').schema.path('shape').enumValues;
		}

		next();
	});
}
util.inherits(BaseFieldSchema, Schema);

var FormFieldSchema = new BaseFieldSchema();

FormFieldSchema.pre('validate', function(next) {
	var error = new mongoose.Error.ValidationError(this);


	//If field is rating check that it has ratingOptions
	if(this.fieldType !== 'rating' && this.fieldType !== 'scale'){

		if(this.ratingOptions && this.ratingOptions.steps && this.ratingOptions.shape){
			error.errors.ratingOptions = new mongoose.Error.ValidatorError({path: 'ratingOptions', message: 'ratingOptions is only allowed for type \'rating\' fields.', type: 'notvalid', value: this.ratingOptions});
			console.error(error);
			return(next(error));
		}

	}else{
		//Setting default values for ratingOptions
		if(!this.ratingOptions.steps){
			this.ratingOptions.steps = 10;
		}
		if(!this.ratingOptions.shape){
			this.ratingOptions.shape = 'Star';
		}

		//Checking that the fieldValue is between 0 and ratingOptions.steps
		if(this.fieldValue+0 > this.ratingOptions.steps || this.fieldValue+0 < 0){
			this.fieldValue = 1;
		}
	}


	//If field is multiple choice check that it has field
	if(this.fieldType !== 'dropdown' && this.fieldType !== 'radio' && this.fieldType !== 'checkbox'){
		if(this.fieldOptions && this.fieldOptions.length > 0){
			error.errors.ratingOptions = new mongoose.Error.ValidatorError({path:'fieldOptions', message: 'fieldOptions are only allowed for type dropdown, checkbox or radio fields.', type: 'notvalid', value: this.ratingOptions});
			console.error(error);
			return(next(error));
		}
	}

	return next();
});

//LogicJump Save
FormFieldSchema.pre('save', function(next) {
	if(!this.globalId){
		this.globalId = tokgen();
	}
	next();
});

//Submission fieldValue correction
FormFieldSchema.pre('save', function(next) {
	if(this.fieldType === 'dropdown' && this.isSubmission){
		this.fieldValue = this.fieldValue.option_value;
	}

	return next();
});


var Field = mongoose.model('Field', FormFieldSchema);
var RatingOptions = mongoose.model('RatingOptions', RatingFieldSchema);

module.exports = FormFieldSchema;

