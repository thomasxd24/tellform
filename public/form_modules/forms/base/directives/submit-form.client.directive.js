'use strict';

//FIXME: Should find an appropriate place for this
//Setting up jsep
jsep.addBinaryOp('contains', 10);
jsep.addBinaryOp('!contains', 10);
jsep.addBinaryOp('begins', 10);
jsep.addBinaryOp('!begins', 10);
jsep.addBinaryOp('ends', 10);
jsep.addBinaryOp('!ends', 10);

angular.module('view-form').directive('submitFormDirective', ['$http', 'TimeCounter', '$filter', '$rootScope', 'SendVisitorData', '$translate', '$timeout',
	function ($http, TimeCounter, $filter, $rootScope, SendVisitorData, $translate, $timeout) {
		return {
			templateUrl: 'form_modules/forms/base/views/directiveViews/form/submit-form.client.view.html',
			restrict: 'E',
			scope: {
				myform: '=',
				ispreview: '='
			},
			controller: function ($document, $window, $scope) {
				var NOSCROLL = false;
				var FORM_ACTION_ID = 'submit_field';
				$scope.forms = {};

				//Don't start timer if we are looking at a design preview
				if ($scope.ispreview) {
					TimeCounter.restartClock();
				}
				if(window.location.href.split('?')[1])
				{
					var values = window.location.href.split('?')[1].split('&').map((value) => {return {[value.split("=")[0]]:value.split("=")[1]}})
					var vari = {}
					values.forEach(element => {
						vari = {
							...vari,
							...element
						}


					});
					var keys = Object.getOwnPropertyNames(vari)
					$scope.myform.variables = vari

				}



				var form_fields_count = $scope.myform.form_fields.filter(function (field) {
					return field.fieldType !== 'statement';
				}).length;

				var nb_valid = $filter('formValidity')($scope.myform);
				$scope.translateAdvancementData = {
					done: nb_valid,
					total: form_fields_count,
					answers_not_completed: form_fields_count - nb_valid
				};

				$scope.reloadForm = function () {
					//Reset Form

					$scope.myform.submitted = false;
					$scope.myform.visible_form_fields = [$scope.myform.visible_form_fields[0]]
					$scope.myform.form_fields = _.chain($scope.myform.visible_form_fields).map(function (field) {
						field.fieldValue = '';
						return field;
					}).value();;
					console.log($scope.myform.form_fields)

					$scope.loading = false;
					$scope.error = '';

					$scope.selected = {
						_id: '',
						index: 0
					};
					$scope.setActiveField($scope.myform.form_fields[0]._id, 0, false);

					//Reset Timer
					TimeCounter.restartClock();
				};

                /*
                ** Field Controls
                */


				var evaluateLogicJump = function (field, jump) {
					var logicJump = jump;
					if (logicJump.expressionString && logicJump.valueB && field.fieldValue) {
						var parse_tree = jsep(logicJump.expressionString);
						var left, right;

						if (parse_tree.left.name === 'field') {
							left = field.fieldValue;
							right = logicJump.valueB;
						} else {
							left = logicJump.valueB;
							right = field.fieldValue;
						}

						if (field.fieldType === 'number' || field.fieldType === 'scale' || field.fieldType === 'rating') {
							switch (parse_tree.operator) {
								case '==':
									return (parseInt(left) === parseInt(right));
								case '!=':
									return (parseInt(left) !== parseInt(right));
								case '>':
									return (parseInt(left) > parseInt(right));
								case '>=':
									return (parseInt(left) > parseInt(right));
								case '<':
									return (parseInt(left) < parseInt(right));
								case '<=':
									return (parseInt(left) <= parseInt(right));
								default:
									return false;
							}
						} else {
							switch (parse_tree.operator) {
								case '==':
									return (left === right);
								case '!=':
									return (left !== right);
								case 'contains':
									return (left.indexOf(right) > -1);
								case '!contains':
									/* jshint -W018 */
									return !(left.indexOf(right) > -1);
								case 'begins':
									return left.startsWith(right);
								case '!begins':
									return !left.startsWith(right);
								case 'ends':
									return left.endsWith(right);
								case '!ends':
									return left.endsWith(right);
								default:
									return false;
							}
						}

					}
				};

				var getActiveField = function () {
					if ($scope.selected === null) {
						console.error('current active field is null');
						throw new Error('current active field is null');
					}

					if ($scope.selected._id === FORM_ACTION_ID) {
						return $scope.myform.form_fields.length - 1;
					}
					return $scope.selected.index;
				};

				$scope.isActiveField = function (field) {
					if ($scope.selected._id === field._id) {
						return true
					}
					return false;
				};

				$scope.transform = $rootScope.transform = function (title) {
					if(!title) return;
					var variabes = title.match(/\{(.*?)\}/g)
					if(variabes == null) return title;
					variabes = variabes.map(ele=>ele.replace(/{/g,'').replace(/}/g,''));
					variabes.forEach(element =>
						{
							var isChanged = false;
							$scope.myform.form_fields.forEach(fieldalt=>
								{
									if(fieldalt.variable == element)
									{
										title = title.replace(`{${element}}`, fieldalt.fieldValue);
										isChanged = true
										return;
									}
								})
								if($scope.myform.variables)
								{
									Object.keys($scope.myform.variables).forEach(keyvar=>
										{
											if($scope.myform.variables[element])
											{
												title = title.replace(`{${element}}`, $scope.myform.variables[element]);
												isChanged = true
												return;
											}
										})
								}
								
								if(!isChanged) title = title.replace(`{${element}}`, "________");
								
						})
					return title
				}

				$scope.setActiveField = $rootScope.setActiveField = function (field_id, field_index, animateScroll, fromJump) {
					if ($scope.selected === null || (!field_id && field_index === null)) {
						return;
					}
					var exists = false;
					for (var i = 0; i < $scope.myform.form_fields.length; i++) {
						var currField = $scope.myform.form_fields[i];
						if (currField['_id'] == field_id) {
							exists = true;
							break;
						}
					}

					if(fromJump&&!exists)
					{
						for (var i = 0; i < $scope.myform.original_form_fields.length; i++) {
							var currField = $scope.myform.original_form_fields[i];
							if (currField['_id'] == field_id) {
								$scope.myform.form_fields.push(JSON.parse(JSON.stringify(currField)));
								break;
							}
						}
					}


					if (!field_id) {
						field_id = $scope.myform.form_fields[field_index]._id;
					} else if (field_index === null) {
						field_index = $scope.myform.form_fields.length

						for (var i = 0; i < $scope.myform.form_fields.length; i++) {
							var currField = $scope.myform.form_fields[i];
							if (currField['_id'] == field_id) {
								field_index = i;
								break;
							}
						}
					}

					if ($scope.selected._id === field_id) {
						return;
					}

					$scope.selected._id = field_id;
					$scope.selected.index = field_index;

					form_fields_count = $scope.myform.form_fields.filter(function (field) {
						return field.fieldType !== 'statement';
					}).length;
					
					var nb_valid = $filter('formValidity')($scope.myform);
					$scope.translateAdvancementData = {
						done: nb_valid,
						total: form_fields_count,
						answers_not_completed: form_fields_count - nb_valid
					};

					if (animateScroll) {
						NOSCROLL = true;
						setTimeout(function () {
							$document.scrollToElement(angular.element('.activeField'), -10, 200).then(function () {
								NOSCROLL = false;
								setTimeout(function () {
									if (document.querySelectorAll('.activeField .focusOn').length) {
										//Handle default case
										document.querySelectorAll('.activeField .focusOn')[0].focus();
									} else if (document.querySelectorAll('.activeField input').length) {
										//Handle case for rating input
										document.querySelectorAll('.activeField input')[0].focus();
									} else {
										//Handle case for dropdown input
										document.querySelectorAll('.activeField .selectize-input')[0].focus();
									}
								});
							});
						});
					}
				};

				$scope.$watch('selected.index', function (oldValue, newValue) {
					if (oldValue !== newValue && newValue < $scope.myform.form_fields.length) {
						//Only send analytics data if form has not been submitted
						if (!$scope.myform.submitted) {
							// console.log('SendVisitorData.send()');
							// SendVisitorData.send($scope.myform, newValue, TimeCounter.getTimeElapsed());
						}
					}
				});

				//Fire event when window is scrolled
				$window.onscroll = function () {
					if (!NOSCROLL) {

						var scrollTop = $(window).scrollTop();
						var elemBox = document.getElementsByClassName('activeField')[0].getBoundingClientRect();
						var fieldTop = elemBox.top;
						var fieldBottom = elemBox.bottom;

						var field_id, field_index;
						var elemHeight = $('.activeField').height();

						var submitSectionHeight = $('.form-actions').height();
						var maxScrollTop = $(document).height() - $(window).height();
						var fieldWrapperHeight = $('form_fields').height();

						var selector = 'form > .field-directive:nth-of-type(' + String($scope.myform.form_fields.length - 1) + ')'
						var fieldDirectiveHeight = $(selector).height()
						var scrollPosition = maxScrollTop - submitSectionHeight - fieldDirectiveHeight * 1.2;

						var fractionToJump = 0.7;
						//Focus on field above submit form button
						if ($scope.selected.index === $scope.myform.form_fields.length) {
							if (scrollTop < scrollPosition) {
								field_index = $scope.selected.index - 1;
								$scope.setActiveField(null, field_index, false);
							}
						}

						//Focus on submit form button

						else if ($scope.selected.index === $scope.myform.form_fields.length - 1 && scrollTop > scrollPosition) {
							field_index = $scope.selected.index + 1;
							// $scope.setActiveField(FORM_ACTION_ID, field_index, false);
						}

						//If we scrolled bellow the current field, move to next field
						else if (fieldBottom < (elemHeight+200) * fractionToJump && $scope.selected.index < $scope.myform.form_fields.length - 1) {
							field_index = $scope.selected.index + 1;
							console.log(field_index)
							$scope.setActiveField(null, field_index, false);
						}
						//If we scrolled above the current field, move to prev field
						else if ($scope.selected.index !== 0 && fieldTop > (elemHeight+200) * fractionToJump) {

							field_index = $scope.selected.index - 1;
							console.log(field_index)
							$scope.setActiveField(null, field_index, false);
						}
					}

					$scope.$apply();
				};

				$rootScope.nextField = $scope.nextField = function () {
					if ($scope.selected && $scope.selected.index > -1) {
						if ($scope.selected._id !== FORM_ACTION_ID) {



							var currField = $scope.myform.form_fields[$scope.selected.index];
							if(currField.fieldType == "plate")
							{
								currField.fieldValue = currField.fieldValue.replace(/.$/,currField.fieldValue[currField.fieldValue.length -1].toLowerCase())
							}
							if(currField.logicJump.length!=0)
							{
								$scope.myform.form_fields = $scope.myform.form_fields.slice(0,$scope.selected.index+1)
							}
							let logicJumped = false;
							for (let index = 0; index < currField.logicJump.length; index++) {
								const jump = currField.logicJump[index];
								if (evaluateLogicJump(currField, jump)) {
									$scope.setActiveField(jump.jumpTo, null, true, true);
									logicJumped = true;
									break;
								}
							}
							currField.scoreFinal = 0;
							if(currField.score)
							{
								for (let index = 0; index < currField.score.length; index++) {
									const score = currField.score[index];
									if (currField.fieldValue == score.value) {
										currField.scoreFinal = score.score;
										break;
									}
								}
							}
							
							if (!logicJumped) {
								for (var i = 0; i < $scope.myform.original_form_fields.length; i++) {
									var currFieldi = $scope.myform.original_form_fields[i];
									if (currFieldi['_id'] == currField['_id']) {
										if($scope.myform.original_form_fields[i+1])
										{
											$scope.setActiveField($scope.myform.original_form_fields[i+1]._id, null, true, true);
										}
										else{
											$scope.setActiveField(FORM_ACTION_ID, null, true);
										}

										break;
									}
								}
							}
						} else {
							//If we are at the submit actions page, go to the first field
							$rootScope.setActiveField(null, 0, true);
						}
					} else {
						//If selected is not defined go to the first field
						$rootScope.setActiveField(null, 0, true);
					}

				};

				$rootScope.prevField = $scope.prevField = function () {
					console.log('prevField');
					console.log($scope.selected);
					var selected_index = $scope.selected.index - 1;
					if ($scope.selected.index > 0) {
						$scope.setActiveField(null, selected_index, true);
					}
				};

				$rootScope.goToInvalid = $scope.goToInvalid = function () {
					var field_id = $('.row.field-directive .ng-invalid.focusOn, .row.field-directive .ng-untouched.focusOn:not(.ng-valid)').first().parents('.row.field-directive').first().attr('data-id');
					$scope.setActiveField(field_id, null, true);
				};

                /*
                ** Form Display Functions
                */



				$scope.exitStartPage = function () {
					$scope.myform.startPage.showStart = false;
					if ($scope.myform.form_fields.length > 0) {
						$scope.selected._id = $scope.myform.form_fields[0]._id;
					}
				};

				var getDeviceData = function () {
					var md = new MobileDetect(window.navigator.userAgent);
					var deviceType = 'other';

					if (md.tablet()) {
						deviceType = 'tablet';
					} else if (md.mobile()) {
						deviceType = 'mobile';
					} else if (!md.is('bot')) {
						deviceType = 'desktop';
					}

					return {
						type: deviceType,
						name: window.navigator.platform
					};
				};

				var getIpAndGeo = function () {
					//Get Ip Address and GeoLocation Data
					$.ajaxSetup({ 'async': false });
					var geoData = $.getJSON('https://freegeoip.net/json/').responseJSON;
					$.ajaxSetup({ 'async': true });

					if (!geoData || !geoData.ip) {
						geoData = {
							ip: 'Adblocker'
						};
					}

					return {
						ipAddr: geoData.ip,
						geoLocation: {
							City: geoData.city,
							Country: geoData.country_name
						}
					};
				};

				$rootScope.submitForm = $scope.submitForm = function () {
					if ($scope.forms.myForm.$invalid) {
						$scope.goToInvalid();
						return;
					}

					var _timeElapsed = TimeCounter.stopClock();
					$scope.loading = true;

					var form = _.cloneDeep($scope.myform);


					var deviceData = getDeviceData();
					form.device = deviceData;

					var geoData = getIpAndGeo();
					form.ipAddr = geoData.ipAddr;
					form.geoLocation = geoData.geoLocation;

					form.timeElapsed = _timeElapsed;
					form.percentageComplete = $filter('formValidity')($scope.myform) / $scope.myform.form_fields.length * 100;
					delete form.endPage
					delete form.isLive
					delete form.provider
					delete form.startPage
					delete form.visible_form_fields;
					delete form.analytics;
					delete form.design;
					delete form.submissions;
					delete form.submitted;
					for (var i = 0; i < $scope.myform.form_fields.length; i++) {
						if ($scope.myform.form_fields[i].fieldType === 'dropdown' && !$scope.myform.form_fields[i].deletePreserved) {
							$scope.myform.form_fields[i].fieldValue = $scope.myform.form_fields[i].fieldValue.option_value;
						}

						//Get rid of unnessecary attributes for each form field
						delete form.form_fields[i].submissionId;
						delete form.form_fields[i].disabled;
						delete form.form_fields[i].ratingOptions;
						delete form.form_fields[i].fieldOptions;
						delete form.form_fields[i].logicJump;
						delete form.form_fields[i].description;
						delete form.form_fields[i].validFieldTypes;
						delete form.form_fields[i].fieldType;

					}
					console.log(form)
					var scoreTotal = 0;
					form.form_fields.forEach(element => {
							scoreTotal = scoreTotal+ element.scoreFinal;
					});
					form.scoreTotal = scoreTotal;

					setTimeout(function () {
						$scope.submitPromise = $http.post('/forms/' + $scope.myform._id, form)
							.success(function (data, status) {
								$scope.myform.submitted = true;
								$scope.loading = false;
								SendVisitorData.send(form, getActiveField(), _timeElapsed);
							})
							.error(function (error) {
								$scope.loading = false;
								console.error(error);
								$scope.error = error.message;
							});
					}, 500);
				};

				//Reload our form
				$scope.reloadForm();
			}
		};
	}
]);
