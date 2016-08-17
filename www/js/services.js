angular.module('sovelavi.services', [])

.constant('BASE_URL','http://localhost:56621/')

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


.factory('errorService',function($ionicPopup){
  var openError = function(error) {
    // var newError = {body: error};

     var newError = $ionicPopup.show({
       template: error,
       title: "Une erreur s'est produite",
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
  openError: openError
};

})

.factory('rapporterEvenementService', ['alerteService', '$cordovaCamera', '$rootScope','$http','BASE_URL','errorService', '$cordovaFileTransfer',function (alerteService, $cordovaCamera, $rootScope, $http, BASE_URL, errorService, $cordovaFileTransfer) {
  var takePicture = function (info) {
    var options ={
   destinationType: Camera.DestinationType.FILE_URI,
   encodingType: Camera.EncodingType.JPEG
 };

   $cordovaCamera.getPicture(options)
   .then(function (data) {
         console.log("Camera data :"+ angular.toJson(data));
        //  $rootScope.pictureURL= "data:image/jpeg;base64," + data;
         $rootScope.pictureURL= data;
   }, function (error) {
  console.log("Camera error :"+ angular.toJson(error));
   });
  };

 //
 // function onDeviceReady() {
 //     pictureSource = navigator.camera.PictureSourceType;
 //     destinationType = navigator.camera.DestinationType;
 // }

 function clearCache() {
     navigator.camera.cleanup();
 }

 var retries = 0;

function onCapturePhoto(fileURI) {
    // $rootScope.pictureURL=fileURI;
  console.log("Camera data :"+ angular.toJson(fileURI));

}
var onSendingPhoto =  function (fileURI) {

     var win = function (r) {
         clearCache();
         retries = 0;
         console.log(fileURI);
         alert('Done!');
     };

     var fail = function (error) {
       alert(error);
         if(retries === 0)
          {
             retries ++;
             setTimeout(function() {
                 onCapturePhoto(fileURI);
             }, 1000);
         } else {
             retries = 0;
             clearCache();
             alert('Ups. Something wrong happens!');
         }
     };

     var options = new FileUploadOptions();
     options.fileKey = "file";
     options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
     options.mimeType = "image/jpeg";
     options.params = {}; // if we need to send parameters to the server request
     var ft = new FileTransfer();
     ft.upload(fileURI, encodeURI(BASE_URL+"api/ImageUpload"), win, fail, options);
 };

// var takePicture= function () {
//      navigator.camera.getPicture(onCapturePhoto, onFail, {
//          quality: 100,
//          destinationType: Camera.DestinationType.FILE_URI
//      });
//  };

 function onFail(message) {
     alert('Failed because: ' + message);
 }





var postDonneEvenement =  function (donnee) {


  $http({ method: "POST",
            dataType: 'json',
             headers: {
               'Accept': 'application/json, text/javascript',
              'Content-Type': 'application/json; charset=utf-8'
           },
      data: donnee,
      url: BASE_URL+"api/ApiDonnee"
    }).
        success(function (data, status, headers, config) {
    console.log(data);

        })
        .error(function(error){
            errorService.openError(error);
          console.log("une erreur s'est produite ", error);
        });




};

  return {
    takePicture: takePicture,
    postDonneEvenement: postDonneEvenement,
    onSendingPhoto: onSendingPhoto
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
})

.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork){

  return {
    isOnline: function(){

      if(ionic.Platform.isWebView()){
        return $cordovaNetwork.isOnline();
      } else {
        return navigator.onLine;
      }

    },
    ifOffline: function(){

      if(ionic.Platform.isWebView()){
        return !$cordovaNetwork.isOnline();
      } else {
        return !navigator.onLine;
      }

    }
  };
})

.factory('EvaluerReponseService', ['$http','$rootScope','BASE_URL',function ($http,$rootScope, BASE_URL) {

var getNiveauId = function () {
  $http.get(BASE_URL+"api/GetNiveauIdInfo").success(function (data) {
        $rootScope.niveauInfo=data;
        console.log($rootScope.niveauInfo);
      }).error(function(error){
        console.log("une erreur s'est produite"+ error);
      });
};

var getReponseId = function () {

};

return {
  getNiveauId : getNiveauId,
  getReponseId : getReponseId
};

}])

.factory('mapService', function ($rootScope, $ionicLoading, $compile,uiGmapGoogleMapApi,$timeout, $cordovaGeolocation, $http) {


//   var url = "";
// if(ionic.Platform.isAndroid()){
// 	url = "/android_asset/www/";
//   console.log("real device ok");
//   console.log(url);
// }
//   var map;
//       var initialize = function () {
//         var myLatlng = new google.maps.LatLng(18.5393,-72.3364);
//         $rootScope.newLatLng ={};
//
//         var mapOptions = {
//           center: myLatlng,
//           zoom: 9,
//           mapTypeId: google.maps.MapTypeId.ROADMAP
//         };
//         map = new google.maps.Map(document.getElementById("map"),
//             mapOptions);
//
//         //Marker + infowindow + angularjs compiled ng-click
//         var contentString = "<div><a ng-click='clickTest()'>latitude: {{lat}} <br/> longitude: {{long}}</a><h1>Incident</h1></div> ";
//         var compiled = $compile(contentString)($rootScope);
//
//         var infowindow = new google.maps.InfoWindow({
//           content: compiled[0]
//         });
//
//         var marker = new google.maps.Marker({
//           position: myLatlng,
//           map: map,
//           title: 'Uluru (Ayers Rock)'
//         });
//
//         google.maps.event.addListener(marker, 'click', function() {
//           infowindow.open(map,marker);
//         });
//
//        console.log(map);
//         $rootScope.map = map;
//       };
//
//       var getLayerData = function () {
//           $http.get(url + "js/admin1.json").then(
//             function (data) {
//               console.log(data);
//               map.data.addGeoJson(data.data);
//                     map.data.setStyle(function (feature) {
//                         var color = 'gray';
//                         return ({
//                             fillColor: color,
//                             strokeColor: color,
//                             strokeWeight: 2
//                         });
//                     });
//
//                     map.data.addListener('mouseover', function (event) {
//                        var color2 = 'blue';
//                        map.data.revertStyle();
//                        map.data.overrideStyle(event.feature, {
//                            fillColor: color2,
//                            strokeColor: color2,
//                            strokeWeight: 2
//                        });
//                    });
//
//                    map.data.addListener('mouseout', function (event) {
//                        map.data.revertStyle();
//                    });
//             },
//             function (error) {
//               console.log(error);
//             }
//           );
//       };
//       // google.maps.event.addDomListener(window, 'load', initialize);
//
//       $rootScope.centerOnMe = function() {
//         if(!$rootScope.map) {
//           return;
//         }
//
//         $rootScope.loading = $ionicLoading.show({
//           content: 'Getting current location...',
//           showBackdrop: false
//         });
//
//         navigator.geolocation.getCurrentPosition(function(pos) {
//           console.log(pos.coords.latitude);
//           console.log(pos.coords.longitude);
//
//           $rootScope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
//           console.log($scope.map);
//           $ionicLoading.hide();
//         }, function(error) {
//           alert('Unable to get location: ' + error.message);
//         });
//       };
//
//       $rootScope.clickTest = function() {
//         alert('Example of infowindow with ng-click');
//       };
//
//
//     uiGmapGoogleMapApi.then(function(maps) {
//       // Don't pass timeout parameter here; that is handled by setTimeout below
//       var posOptions = {enableHighAccuracy: false};
//       $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
//         console.log("Got location: " + JSON.stringify(position));
//         initialize();
//         getLayerData();
//       }, function(error) {
//         console.log(error);
//         initialize();
//         getLayerData();
//       });
//     });
//
//     // Deal with case where user does not make a selection
//     $timeout(function() {
//       if (!$rootScope.map) {
//         console.log("No confirmation from user, using fallback");
//         initialize();
//       }
//     }, 5000);
//
// return {
//   initialize: initialize
// };

})
;
