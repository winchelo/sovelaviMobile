angular.module('sovelavi.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {

})

.controller('RapporterEvenementCtrl', ['$scope','rapporterEvenementService','getPositionService','$rootScope',function($scope ,rapporterEvenementService, getPositionService,$rootScope) {

  $scope.$on("$ionicView.afterEnter", function() {

    if(!($rootScope.lat && $rootScope.long)){
      $scope.getLocation();
    }


      });


 $scope.items = ['Sans photo', 'Prendre une photo'];
 $scope.selection = $scope.items[0];


 $scope.evenementInfo = {
   commentaire: '',
   image: ''
 };

 $scope.pictureURL = "http://placehold.it/300x300";

 $scope.takePicture = function () {
   rapporterEvenementService.takePicture($scope.evenementInfo.commentaire);
 };

 $scope.getLocation = function () {
   getPositionService.getLocation();
 };
}])

.controller('MapCtrl', function($scope, $ionicLoading, $compile,uiGmapGoogleMapApi,$timeout, $cordovaGeolocation) {
      var initialize = function () {
        var myLatlng = new google.maps.LatLng(18.5393,-72.3364);
        $scope.newLatLng ={};

        var mapOptions = {
          center: myLatlng,
          zoom: 9,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>latitude: {{lat}} <br/> longitude: {{long}}</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Uluru (Ayers Rock)'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

       console.log(map);
        $scope.map = map;
      };


      // google.maps.event.addDomListener(window, 'load', initialize);

      $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          console.log(pos.coords.latitude);
          console.log(pos.coords.longitude);

          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          console.log($scope.map);
          $ionicLoading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };

      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click');
      };


    uiGmapGoogleMapApi.then(function(maps) {
      // Don't pass timeout parameter here; that is handled by setTimeout below
      var posOptions = {enableHighAccuracy: false};
      $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
        console.log("Got location: " + JSON.stringify(position));
        initialize();
      }, function(error) {
        console.log(error);
        initialize();
      });
    });

    // Deal with case where user does not make a selection
    $timeout(function() {
      if (!$scope.map) {
        console.log("No confirmation from user, using fallback");
        initialize();
      }
    }, 5000);

    })
;
