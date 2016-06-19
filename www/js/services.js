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
}]);
