'use strict';

// Setting up route
angular.module('view-form').config(['$stateProvider',
	function($stateProvider) {
		// Forms state routing
		$stateProvider.
		state('submitForm', {
			url: '/forms/:formId', // refer to https://github.com/angular-ui/ui-router/wiki/URL-Routing#query-parameters for url query
			templateUrl: '/static/form_modules/forms/base/views/submit-form.client.view.html',
			resolve: {
				Forms: 'Forms',
				myForm: function (Forms, $q, $state, $stateParams) {
                    var deferred = $q.defer();

                    Forms.get({formId: $stateParams.formId}).$promise.then(function(data) {
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

angular.module('view-form').config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode(true);    
}]);