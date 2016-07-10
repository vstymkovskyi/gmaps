/**
 * Created by Stymkovskiy Vitalii on 10.07.2016.
 */
locationList.service('MapsService', function($filter, LocalService) {
	function MapsService(scope) {
		var _scope = scope;
		var _self  = this;

		//also MapsService.prototype can be used

		// Sets the map on all markers in the array.
		this.setMarkers    = function() {
			angular.forEach(_scope.mapMarkers, function(marker, i) {
				marker.setMap(_scope.map);
			});
		};

		this.createMarkers = function() {
			angular.forEach(_scope.locationsArray, function(location, i) {
				_scope.mapMarkers[i] = _self.createMarker(location);
			});
			_self.setMarkers();
		};

		this.createMarker  = function(data) {
			var coords   = new google.maps.LatLng(data.lat, data.lng),
			    infoBox  = new google.maps.InfoWindow({
				    content: data.name +' '+data.address
			    }),
			    marker = new google.maps.Marker({
				    position: coords,
				    map:      _scope.map,
				    title:    data.name,
				    draggable: true
			    });
			marker.addListener('click', function() {
				infoBox.open(_scope.map, marker);
			});
			marker.addListener('dragend', function(event) {
				var index = $filter('getLocationByName')(this.title, _scope.locationsArray);
				if(index !== null) {
					var address = '';
					var promise = _scope.geocodeCoordinates(event.latLng.lat(), event.latLng.lng());
					promise.then(function( array ) {
						if(array.length > 0) {
							address = array[0].formatted_address;
						}
						//update location item
						_scope.locationsArray[index].lat     = parseFloat(event.latLng.lat().toFixed(1));
						_scope.locationsArray[index].lng     = parseFloat(event.latLng.lng().toFixed(1));
						_scope.locationsArray[index].address = address;
					});
				}
			});
			marker.setMap(_scope.map);

			return marker;
		};

		this.modifyMarker  = function(i, data) {
			_scope.mapMarkers[i] = _self.createMarker(data);
			_scope.mapMarkers[i].setMap(_scope.map);
			_scope.showCity(i);
			LocalService.update(_scope.locationsArray);
		};
	}

	return MapsService;
});