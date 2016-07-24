angular.module('sovelavi.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.acceuil', {
    url: '/acceuil',
    views: {
      'menuContent': {
        templateUrl: 'templates/acceuil.html',
        controller: 'AcceuilCtrl'
      }
    }
  })

  .state('app.profil', {
      url: '/profil',
      views: {
        'menuContent': {
          templateUrl: 'templates/profil.html'
        }
      }
    })
    .state('app.evenement', {
      url: '/event',
      views: {
        'menuContent': {
          templateUrl: 'templates/evenement.html',
          controller: 'RapporterEvenementCtrl'
        }
      }
    })

    .state('app.donnee', {
      url: '/donnee',
      views: {
        'menuContent': {
          templateUrl: 'templates/donnee-collectivite.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

    .state('app.carte', {
      url: '/carte',
      views: {
        'menuContent': {
          templateUrl: 'templates/carte.html',
          controller: 'MapCtrl'
        }
      }
    })

  .state('app.apropos', {
    url: '/apropos',
    views: {
      'menuContent': {
        templateUrl: 'templates/apropos.html'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/acceuil');
});
