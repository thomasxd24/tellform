'use strict';

// Setting up route
angular.module('view-form').config(['$stateProvider',
	function($stateProvider) {
		// Forms state routing
		$stateProvider.
		state('submitForm', {
			url: '/forms/:formId?q1&q2&q3&q4&q5&q6&q7&q8&q9&q10',
			templateUrl: '/static/form_modules/forms/base/views/submit-form.client.view.html',
			resolve: {
				Forms: 'Forms',
				myForm: function (Forms, $q, $state, $stateParams) {
                    var deferred = $q.defer();
					//TODO try to inject variable here
                    Forms.get({formId: $stateParams.formId}).$promise.then(function(data) {
						// data = {
						// 	...$stateParams,
						// 	...data
						// };
						// console.log(data)
                    	deferred.resolve(data);
				    },  function(reason) {
                        $state.go('unauthorizedFormAccess');
                        deferred.reject({redirectTo: 'unauthorizedFormAccess'});
					});
				    return deferred.promise;
				}
			},
			controller: 'SubmitFormController',
			controllerAs: 'ctrl'
		}).
        state('unauthorizedFormAccess', {
            url: '/forms/unauthorized',
            templateUrl: '/static/form_modules/forms/base/views/form-unauthorized.client.view.html'
	    })
	    .state('formNotFound', {
            url: '*path',
            templateUrl: '/static/form_modules/forms/base/views/form-not-found.client.view.html'
	    });
    }
]);
