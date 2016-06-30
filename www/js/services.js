angular.module('sovelavi.services', [])

.factory('alerteService',function($ionicPopup){
  var openAlerte = function(alerte) {
    // var newError = {body: error};

     var newError = $ionicPopup.show({
       template: alerte,
       title: "Une alerte s'est produite",
       scope: null,
       buttons: [

         {
           text: 'Ok',
           type: 'button-small button-balanced',
           onTap: function(e) {
             return;
           }
          }
       ]
     });
   };

return {
  openAlerte: openAlerte
};

})

.factory('rapporterEvenementService', ['alerteService', function (alerteService) {

  var takePicture = function (info) {
   alerteService.openAlerte (info);
  };
  return {
    takePicture: takePicture
  };
}])

.factory('getPositionService', function ($cordovaGeolocation, alerteService, $rootScope) {

var getLocation = function () {
  // var posOptions = {timeout: 25000, enableHighAccuracy: false};
  // $cordovaGeolocation
  //   .getCurrentPosition(posOptions)
  //   .then(function (position) {
  //     $rootScope.lat  = position.coords.latitude;
  //     $rootScope.long = position.coords.longitude;
  //     //alerteService.openAlerte(lat);
  //   }, function(err) {
  //     alerteService.openAlerte(err.message);
  //     console.log(err.message);
  //   });

  navigator.geolocation.getCurrentPosition(function(pos) {


    $rootScope.lat  = pos.coords.latitude;
    $rootScope.long = pos.coords.longitude;
    console.log($rootScope.lat);
    console.log($rootScope.long);

  }, function(error) {
    alert('Unable to get location: ' + error.message);
  });

};

return {
  getLocation: getLocation
};
});
