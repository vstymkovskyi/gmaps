/**
 * Created by VStymkovskyi on 7/8/2016.
 */
angular.module( 'app', [
	'ui.bootstrap',
	'ui.router'
]).config( function( $stateProvider, $urlRouterProvider ) {
	console.log('Angular has started');

	// fix for trailing slashes
	$urlRouterProvider.rule(function ($injector, $location) {
		var path = $location.url();
		// check to see if the path already has a slash where it should be
		if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {return;}
		if (path.indexOf('?') > -1) {return path.replace('?', '/?');}
		return path + '/';
	});
});