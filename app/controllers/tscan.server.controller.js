'use strict';

var config = require('../../config/config'),
fetch = require('node-fetch');

/**cd
 * Module dependencies.
 */
exports.index = async function(req, res) {
	var dealer = req.param.dealerID;
	console.log(req.body);
	await fetch('https://webhook.site/84b1f31e-11c3-4980-9dcb-be9ab2cd573d', {
        method: 'post',
        body:    JSON.stringify(req.body.scan),
        headers: { 'Content-Type': 'application/json' },
    	})
	res.json({Status:"success",Message:"Data received by automaktion."})
};
exports.delete = async function(req, res) {
	var dealer = req.param.dealerID;
	console.log(req.body);
	res.json({Status:"success",Message:"Data deleted."})
};