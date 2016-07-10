/**
 * Created by Stymkovskiy Vitalii on 08.07.2016.
 */
var locationList = angular.module('locationList', ['ngMaterial', 'ngMessages', 'ui.bootstrap'])
	.config(function() {

	})
	.controller('listCtrl', function ($q, $scope, $mdDialog, $filter, LocalService, MapsService) {
		var STARTZOOM     = 3,
			ZOOM          = 8,
			COORDISNATES  = {lat: 30, lng: 0};
		$scope.infoBox    = new google.maps.InfoWindow();
		$scope.geocoder   = new google.maps.Geocoder();
		$scope.mapMarkers = [];

		$scope.MapsService = new MapsService($scope);

		$scope.initializeMap = function() {
			var mapOptions = {
				center: new google.maps.LatLng(COORDISNATES.lat, COORDISNATES.lng),
				zoom:   STARTZOOM
			};
			var mapContent = document.getElementById('locationsMap');
			if(mapContent != null) {
				if($scope.waitForMap != undefined)
					clearTimeout($scope.waitForMap);

				$scope.map = new google.maps.Map(mapContent, mapOptions);
				$scope.MapsService.createMarkers();
			} else {
				$scope.waitForMap = setTimeout(function () {
					$scope.initializeMap();
				}, 2000);
			}
		};

		if($scope.locationsArray == undefined) {
			var jsonArray = LocalService.get('locationsList');
			$scope.locationsArray = angular.fromJson(jsonArray);
			if($scope.locationsArray == null) {
				$scope.locationsArray = [];
			}
		}

		$scope.showAllPlaces = function() {
			$scope.map.setZoom(STARTZOOM);
			$scope.map.setCenter(COORDISNATES);
		};

		$scope.geocodeAddress = function(address, availableLocations) {
			var deferred = $q.defer();
			if(availableLocations != undefined) {
				deferred.resolve( availableLocations );
			} else {
				$scope.geocoder.geocode({'address': address}, function (results, status) {
					if (status === google.maps.GeocoderStatus.OK) {
						deferred.resolve(results);
					} else {
						deferred.resolve([]);
					}
				});
			}

			return deferred.promise;
		};

		$scope.selectedAddress = function(item) {
			$scope.place.lat = item.geometry.location.lat().toFixed(1);
			$scope.place.lng = item.geometry.location.lng().toFixed(1);
		};

		$scope.geocodeCoordinates = function(lat, lng) {
			var deferred = $q.defer();
			$scope.geocoder.geocode( {location: {'lat': parseFloat(lat), 'lng': parseFloat(lng)}}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					deferred.resolve( results );
				} else {
					console.log(status);
					deferred.resolve([]);
				}
			});

			return deferred.promise;
		};

		$scope.selectedCoordinates = function() {
			var el = $scope.place;
			if(el.lat >= 0 && el.lng >= 0) {
				var promise = $scope.geocodeCoordinates(el.lat, el.lng);
				promise.then(function( array ) {
					if(array.length > 0) {
						$scope.place.address = array[0].formatted_address;
					} else {
						$scope.place.address = '';
					}
				});
			}
		};

		$scope.showCity = function(ind, zoom) {
			if(zoom == undefined )
				zoom = ZOOM;
			var coords = COORDISNATES;
			if($scope.locationsArray.length > 0) {
				var location = $scope.locationsArray[ind];
				    coords   = new google.maps.LatLng(location.lat, location.lng);
			}

			$scope.map.setZoom(zoom);
			$scope.map.setCenter(coords);
		};

		$scope.addPlace = function(place) {
			var newPlace = angular.copy(place);
			var index    = $scope.locationsArray.push(newPlace);
			$scope.MapsService.modifyMarker(index-1, newPlace);
			$mdDialog.hide();
		};

		$scope.updatePlace = function(index, place) {
			$scope.locationsArray[index] = place;
			$scope.mapMarkers[index].setMap(null);
			//add new marker
			$scope.MapsService.modifyMarker(index, place);
			$mdDialog.hide();
		};

		$scope.deletePlace = function() {
			$scope.locationsArray.splice(this.$index, 1);
			$scope.mapMarkers[this.$index].setMap(null);
			$scope.mapMarkers.splice(this.$index, 1);
			LocalService.update($scope.locationsArray);
			$scope.showCity(0, STARTZOOM);
		};

		$scope.showEditForm = function(ev) {
			var index = this.$index,
			    el    = angular.copy($scope.locationsArray[index]);
			$mdDialog.show({
				controller: function () {
					this.parent  = $scope;
					this.index   = index;
					$scope.place = el;
				},
				controllerAs: 'DialogCtrl',
				templateUrl: '/assets/templates/editForm.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true
			});
		};

		$scope.showAddForm = function(ev) {
			$mdDialog.show({
				controller: function () {
					this.parent = $scope;
				},
				controllerAs: 'DialogCtrl',
				templateUrl: '/assets/templates/addForm.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true
			});
		};

		$scope.hideDialog = function() {
			$mdDialog.hide();
		};

		$scope.resetForm = function() {
			$scope.place = {nam: '', lat: '', lng: '', address: ''}
		};

	}).filter('getLocationByName', function() {
		return function(propertyValue, collection) {
			var index = null;
			angular.forEach(collection, function(val, key) {
				if(index === null) {
					if (propertyValue === val.name) {
						index = key;
					}
				}
			});

			return index;
		}
	});