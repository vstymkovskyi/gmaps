/**
 * Created by Stymkovskiy Vitalii on 10.07.2016.
 */
locationList.factory('LocalService', function() {
	return {
		get: function(key) {
			return localStorage.getItem(key);
		},
		set: function(key, val) {
			return localStorage.setItem(key, val);
		},
		update: function(array) {
			this.unset('locationsList');
			this.set('locationsList', angular.toJson(array));
		},
		unset: function(key) {
			return localStorage.removeItem(key);
		}
	}
});