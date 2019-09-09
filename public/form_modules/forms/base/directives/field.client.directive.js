'use strict';

// coffeescript's for in loop
var __indexOf =
	[].indexOf ||
	function(item) {
		for (var i = 0, l = this.length; i < l; i++) {
			if (i in this && this[i] === item) return i;
		}
		return -1;
	};

angular.module('view-form').directive('fieldDirective', [
	'$http',
	'$compile',
	'$rootScope',
	'$templateCache',
	'supportedFields',
	function($http, $compile, $rootScope, $templateCache, supportedFields) {
		var getTemplateHtml = function(fieldType) {
			var type = fieldType;

			var supported_fields = [
				'textfield',
				'textarea',
				'date',
				'dropdown',
				'hidden',
				'password',
				'radio',
				'legal',
				'plate',
				'scale',
				'phone',
				'statement',
				'rating',
				'yes_no',
				'number',
				'natural'
			];

			var templateUrl = 'form_modules/forms/base/views/directiveViews/field/';

			if (__indexOf.call(supportedFields, type) >= 0) {
				templateUrl = templateUrl + type + '.html';
			}
			return $templateCache.get(templateUrl);
		};

		return {
			template: '<div>{{field.title}}</div>',
			restrict: 'E',
			scope: {
				field: '=',
				required: '&',
				design: '=',
				index: '=',
				forms: '='
			},
			link: function(scope, element) {
				$rootScope.chooseDefaultOption = scope.chooseDefaultOption = function(
					type
				) {
					if (type === 'yes_no') {
						scope.field.fieldValue = 'true';
					} else if (type === 'rating') {
						scope.field.fieldValue = 0;
					} else if (scope.field.fieldType === 'radio') {
						scope.field.fieldValue = scope.field.fieldOptions[0].option_value;
					} else if (type === 'legal') {
						scope.field.fieldValue = 'true';
						$rootScope.nextField();
					}
				};
				scope.nextField = $rootScope.nextField;
				scope.setActiveField = $rootScope.setActiveField;

				async function processFile(event) {
					var content = event.target.result;
					var image = await resizedataURL(content, 500, 600);
					sendFileToCloudVision(image.replace('data:image/jpeg;base64,', ''));
				}

				function resizedataURL(datas) {
					return new Promise(async function(resolve, reject) {
						// We create an image to receive the Data URI
						var img = document.createElement('img');

						// When the event "onload" is triggered we can resize the image.
						img.onload = function() {
							// We create a canvas and get its context.
							var canvas = document.createElement('canvas');
							var ctx = canvas.getContext('2d');

							// We set the dimensions at the wanted size.
							canvas.width = this.width / 4;
							canvas.height = this.height / 4;

							// We resize the image with the canvas method drawImage();
							ctx.drawImage(this, 0, 0, this.width / 4, this.height / 4);

							var dataURI = canvas.toDataURL('image/jpeg', 0.4);

							// This is the return of the Promise
							resolve(dataURI);
						};

						// We put the Data URI in the image's src attribute
						img.src = datas;
					});
				} // Use it like : var newDataURI = await resizedataURL('yourDataURIHere', 50, 50);

				async function sendFileToCloudVision(content) {
					var type = 'DOCUMENT_TEXT_DETECTION';

					// Strip out the file prefix when you convert to json.
					var data = {
						requests: [
							{
								image: {
									content: content
								},
								features: [
									{
										type: type,
										maxResults: 200
									}
								]
							}
						]
					};
					var request = {
						method: 'POST',
						url:
							'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCh8MDPaOWhAUsOARu0_6luxZop6pTRFxo',
						data: JSON.stringify(data),
						headers: {
							'Content-Type': 'application/json'
						}
					};
					window.t1 = performance.now();
					console.log("Processing Image took"+ (window.t1 - window.t0) + " milliseconds.")
					$http(request)
						.success(function(d) {
							console.log(d)
							scope.loadingText = '';
							let text = d.responses[0].fullTextAnnotation.text;
							text = text.replace(/\s/g, '');
							var currField = scope.field;
							
							currField.fieldValue = text.match(
								/([A-Z]|[0-9]){2}-([A-Z]|[0-9]){3}-([A-Z]|[0-9]){2}/
							)[0];
							window.t2 = performance.now();
					console.log("Uploading Image and getting a response took"+ (window.t2 - window.t1) + " milliseconds.")
						})
						.error(function(f) {
							console.log(f);
						});
				}

				scope.uploadFile = function(item) {
					window.t0 = performance.now();
					var file = item.files[0];
					console.log(file);
					scope.loadingText = 'Chargement...';
					var reader = new FileReader();

					reader.onloadend = processFile;
					reader.readAsDataURL(file);
				};

				//Set format only if field is a date
				if (scope.field.fieldType === 'date') {
					scope.dateOptions = {
						changeYear: true,
						changeMonth: true,
						altFormat: 'dd/mm/yyyy',
						yearRange: '1900:-0',
						defaultDate: 0
					};
				}

				var fieldType = scope.field.fieldType;

				if (
					scope.field.fieldType === 'number' ||
					scope.field.fieldType === 'textfield' ||
					scope.field.fieldType === 'email' ||
					scope.field.fieldType === 'link'
				) {
					switch (scope.field.fieldType) {
						case 'textfield':
							scope.input_type = 'text';
							break;
						case 'plate':
							scope.input_type = 'text';
							break;
						case 'email':
							scope.input_type = 'email';
							scope.placeholder = 'joesmith@example.com';
							break;
						case 'number':
							scope.input_type = 'text';
							scope.validateRegex = /^\d+(\,\d+)?$/;
							break;
						case 'phone':
							scope.input_type = 'tel';
							break;
						default:
							scope.input_type = 'url';
							scope.placeholder = 'http://example.com';
							break;
					}
					fieldType = 'textfield';
				}

				var template = getTemplateHtml(fieldType);
				element.html(template).show();
				var output = $compile(element.contents())(scope);
			}
		};
	}
]);
