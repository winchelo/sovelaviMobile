angular.module('sovelavi.controllers', [])

.controller('AppCtrl',['$scope','$ionicModal','$timeout', function($scope, $ionicModal, $timeout) {

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
}])

.controller('PlaylistsCtrl', function($scope) {

})

.controller('AcceuilCtrl',['$scope', 'getPositionService', '$rootScope',function ($scope, getPositionService, $rootScope) {
  $scope.$on("$ionicView.afterEnter", function() {

    if(!($rootScope.lat && $rootScope.long)){
      $scope.getLocation();
      console.log("rootScope not defined");
        }
      });

      $scope.getLocation = function () {
        getPositionService.getLocation();
      };

}])

.controller('RapporterEvenementCtrl', ['$scope','rapporterEvenementService','getPositionService','$rootScope',function($scope ,rapporterEvenementService, getPositionService,$rootScope) {

  $scope.$on("$ionicView.afterEnter", function() {

    if(!($rootScope.lat && $rootScope.long)){
      $scope.getLocation();
        console.log("rootScope not defined");
        }
      });



 $scope.evenementInfo = {
   commentaire: '',
   image: ''
 };

 $rootScope.pictureURL = "url";

 $scope.takePicture = function () {
   rapporterEvenementService.takePicture($scope.evenementInfo.commentaire);
 };

 $scope.getLocation = function () {
   getPositionService.getLocation();
 };
}])

.controller('MapCtrl', function($scope, $ionicLoading, $compile,uiGmapGoogleMapApi,$timeout, $cordovaGeolocation, $http, $rootScope) {


    $scope.items = ['Departement', 'Commune'];
    $scope.selection = $scope.items[0];

    $scope.updateOption = function(selection){
      console.log(selection);
    };

    var url = "";
  if(ionic.Platform.isAndroid()){
  	url = "/android_asset/www/";
    console.log("real device ok");
    console.log(url);
  }
    var map;
        var initialize = function () {
          var myLatlng = new google.maps.LatLng(18.5393,-72.3364);
          $rootScope.newLatLng ={};

          var mapOptions = {
            center: myLatlng,
            zoom:8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          map = new google.maps.Map(document.getElementById("map"),
              mapOptions);

          //Marker + infowindow + angularjs compiled ng-click
          var contentString = "<div><a ng-click='clickTest()'>latitude: {{lat}} <br/> longitude: {{long}}</a><h1>Incident</h1></div> ";
          var compiled = $compile(contentString)($rootScope);

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
          $rootScope.map = map;
        };

        var getLayerData = function () {
            $http.get(url + "js/admin1.json").then(
              function (data) {
                console.log(data);
                map.data.addGeoJson(data.data);
                      map.data.setStyle(function (feature) {
                          var color = 'gray';
                          return ({
                              fillColor: color,
                              strokeColor: color,
                              strokeWeight: 2
                          });
                      });

                      map.data.addListener('mouseover', function (event) {
                         var color2 = 'blue';
                         map.data.revertStyle();
                         map.data.overrideStyle(event.feature, {
                             fillColor: color2,
                             strokeColor: color2,
                             strokeWeight: 2
                         });
                     });

                     map.data.addListener('mouseout', function (event) {
                         map.data.revertStyle();
                     });
              },
              function (error) {
                console.log(error);
              }
            );
        };
        // google.maps.event.addDomListener(window, 'load', initialize);

        $rootScope.centerOnMe = function() {
          if(!$rootScope.map) {
            return;
          }

          $rootScope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
          });

          navigator.geolocation.getCurrentPosition(function(pos) {
            console.log(pos.coords.latitude);
            console.log(pos.coords.longitude);

            $rootScope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            console.log($scope.map);
            $ionicLoading.hide();
          }, function(error) {
            alert('Unable to get location: ' + error.message);
          });
        };

        $rootScope.clickTest = function() {
          alert('Example of infowindow with ng-click');
        };


      uiGmapGoogleMapApi.then(function(maps) {
        // Don't pass timeout parameter here; that is handled by setTimeout below
        var posOptions = {enableHighAccuracy: false};
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
          console.log("Got location: " + JSON.stringify(position));
          initialize();
          getLayerData();
        }, function(error) {
          console.log(error);
          initialize();
          getLayerData();
        });
      });

      // Deal with case where user does not make a selection
      $timeout(function() {
        if (!$rootScope.map) {
          console.log("No confirmation from user, using fallback");
          initialize();
        }
      }, 5000);

    })
;
