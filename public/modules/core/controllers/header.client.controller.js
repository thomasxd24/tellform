'use strict';

angular.module('core').controller('HeaderController', ['$rootScope', '$scope', 'Menus', '$state', 'Auth', 'User', '$window', '$translate',
	function ($rootScope, $scope, Menus, $state, Auth, User, $window, $translate) {

		$rootScope.signupDisabled = $window.signupDisabled;

		$scope.user = $rootScope.user = Auth.ensureHasCurrentUser();

	    $scope.authentication = $rootScope.authentication = Auth;

		$rootScope.languages = $scope.languages = ['en', 'fr', 'es', 'it', 'de'];

		//Set global app language
		$rootScope.language = $scope.user.language;
		$translate.use($scope.user.language);

		$scope.isCollapsed = false;
		$rootScope.hideNav = false;
		$scope.menu = Menus.getMenu('topbar');

	    $scope.signout = function() {
		    var promise = User.logout();
			promise.then(function() {
				Auth.logout();
				Auth.ensureHasCurrentUser();
				$scope.user = $rootScope.user = null;
				$state.go('listForms');

				//Refresh view
				$state.reload();
			},
			function(reason) {
			  	console.error('Logout Failed: ' + reason);
			});
	    };

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			$scope.isCollapsed = false;
			$rootScope.hideNav = false;
			if ( angular.isDefined( toState.data ) ) {

				if ( angular.isDefined( toState.data.hideNav ) ) {
		        	$rootScope.hideNav = toState.data.hideNav;
		        }
		    }
		});

	}
]);
