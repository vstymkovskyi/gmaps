/**
 * Created by VStymkovskyi on 7/8/2016.
 */
angular.module( 'app', [
	'ui.bootstrap',
	'ui.router',
	'locationList'
]).config( function( $stateProvider ) {
	$stateProvider
	.state('main', {
		module: 'public',
		url: '/main',
		views:  {
			"master": {
				controller:  'AppCtrl',
				templateUrl: '/assets/templates/content.html'
			},
			"sidebar": {
				controller:  'AppCtrl',
				templateUrl: '/assets/templates/sidebar.html'
			}
		}
	})
}).controller('AppCtrl', function ($scope, $state) {
	$state.go('main');

}).directive('footer', function () {
	return {
		templateUrl: '/assets/templates/footer.html'
	}
});