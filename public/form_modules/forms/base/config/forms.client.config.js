'use strict';

// Configuring the Forms drop-down menus
angular.module('view-form')
.filter('formValidity', function(){
	return function(formObj){
		if(formObj && formObj.form_fields ){

			var fields = formObj.form_fields;
			var valid_count = fields.filter(function(field){
				if(typeof field === 'object' && field.fieldType !== 'rating' && field.fieldType !== 'statement'){
					return !!(field.fieldValue);
				} else if (field.fieldType === 'rating'){
					return true;
				}

			}).length;
			
			return valid_count;
		}
		return 0;
	};
});

angular.module('view-form').value('supportedFields', [
	'textfield',
	'textarea',
	'date',
	'dropdown',
	'hidden',
	'password',
	'radio',
	'legal',
	'checkbox',
	'plate',
	'phone',
	'scale',
	'statement',
	'rating',
	'yes_no',
	'number',
	'natural'
]);

angular.module('view-form').constant('VIEW_FORM_URL', '/forms/:formId/render');

