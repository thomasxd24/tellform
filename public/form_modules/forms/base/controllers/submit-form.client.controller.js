'use strict';

// SubmitForm controller
angular.module('view-form').controller('SubmitFormController', [
	'$scope', '$rootScope', '$state', '$translate', 'myForm',
	function ($scope, $rootScope, $state, $translate, myForm) {

		$scope.myform = myForm;


		$(".loader").fadeOut("slow");
		// console.log("linear-gradient(rgba(255,255,255, .75),rgba(255,255,255, .75)),url('" + myForm.design.colors.backgroundImage + "')")
		document.body.style.background = "linear-gradient(rgba(255,255,255, .75),rgba(255,255,255, .75)),url('" + myForm.design.colors.backgroundImage + "')";
		$translate.use(myForm.language);
	}
]);
