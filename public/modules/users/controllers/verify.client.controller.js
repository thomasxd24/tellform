'use strict';

angular.module('users').controller('VerifyController', ['$scope', '$state', '$rootScope', 'User', 'Auth', '$stateParams', '$translate', '$window',
	function($scope, $state, $rootScope, User, Auth, $stateParams, $translate, $window) {
		$translate.use($window.locale);

		$scope.isResetSent = false;
		$scope.credentials = {};
		$scope.error = '';

		// Submit forgotten password account id
		$scope.resendVerifyEmail = function() {
			User.resendVerifyEmail($scope.credentials.email).then(
				function(response){
					$scope.success = response.message;
					$scope.error = null;
					$scope.credentials = null;
					$scope.isResetSent = true;
				},
				function(error){
					$scope.error = error;
					$scope.success = null;
					$scope.credentials.email = null;
					$scope.isResetSent = false;
				}
			);
		};

		//Validate Verification Token
		$scope.validateVerifyToken = function() {
			if($stateParams.token){
				console.log($stateParams.token);
				User.validateVerifyToken($stateParams.token).then(
					function(response){
						$scope.success = response.message;
						$scope.error = null;
						$scope.isResetSent = true;
						$scope.credentials.email = null;
					},
					function(error){
						$scope.isResetSent = false;
						$scope.success = null;
						$scope.error = error;
						$scope.credentials.email = null;
					}
				);
			}
		};
	}
]);