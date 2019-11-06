'use strict';

/**
 * Module dependencies.
 */
var forms = require('../../app/controllers/forms.server.controller'),
	core = require('../../app/controllers/core.server.controller'),
	tscan = require('../../app/controllers/tscan.server.controller')

module.exports = function(app) {
	// Core routing
	app.route('/')
		.get(core.index);
		app.route('/tscan/:dealerID/')
		.post(tscan.index);
		app.route('/tscan/delete/:dealerID/')
		.post(tscan.delete)


	app.route('/subdomain/api/')
		.get(core.redoc);
};

