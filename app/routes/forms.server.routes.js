'use strict';

/**
 * Module dependencies.
 */
var multer  = require('multer')
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
	  cb(null, file.fieldname + '-' + Date.now()+'.jpg')
	}
  })

  var upload = multer({ storage: storage })

var forms = require('../../app/controllers/forms.server.controller'),
	auth = require('../../config/passport_helpers'),
	config = require('../../config/config'),
	core = require('../../app/controllers/core.server.controller');

module.exports = function(app) {
	// Form Routes
	if(!config.subdomainsDisabled) {
		app.route('/subdomain/:userSubdomain((?!api$)[A-Za-z0-9]+)/')
		 .get(core.form);

		app.route('/subdomain/:userSubdomain((?!api$)[A-Za-z0-9]+)/forms/([a-zA-Z0-9]+)')
		 .post(forms.createSubmission);

		app.route('/subdomain/:userSubdomain((?!api$)[A-Za-z0-9]+)/forms/:formIdFast([a-zA-Z0-9]+)/render')
		 .get(forms.readForRender);

		app.route('/forms/:formId([a-zA-Z0-9]+)/render')
			.get(auth.isAuthenticatedOrApiKey, forms.hasAuthorization, forms.readForRender);
	} else {
		app.route('/forms/:formIdFast([a-zA-Z0-9]+)/render')
			.get(forms.readForRender);

		app.route('/view/')
		 	.get(core.form);
	}

   	app.route('/forms/:formIdFast([a-zA-Z0-9]+)')
		.post(forms.createSubmission)
		var cpUpload = upload.fields([{ name: 'image', maxCount: 1 }])
		app.route('/plate')
        .post(cpUpload,forms.getPlate)

	app.route('/forms')
		.get(auth.isAuthenticatedOrApiKey, forms.list)
		.post(auth.isAuthenticatedOrApiKey, forms.create);

	app.route('/forms/:formId([a-zA-Z0-9]+)')
		.get(forms.read)
		.post(forms.createSubmission)
		.put(auth.isAuthenticatedOrApiKey, forms.hasAuthorization, forms.update)
		.delete(auth.isAuthenticatedOrApiKey, forms.hasAuthorization, forms.delete);

	app.route('/forms/:formId([a-zA-Z0-9]+)/submissions')
		.get(auth.isAuthenticatedOrApiKey, forms.hasAuthorization, forms.listSubmissions)
		.delete(auth.isAuthenticatedOrApiKey, forms.hasAuthorization, forms.deleteSubmissions);



	// Slower formId middleware
	app.param('formId', forms.formByID);

	// Fast formId middleware
	app.param('formIdFast', forms.formByIDFast);

};
