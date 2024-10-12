angular.module('crowdfundingApp', ['ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: 'home.html',
        controller: 'HomeController'
      })
      .when('/fundraiser/:id', {
        templateUrl: 'fundraiser.html',
        controller: 'FundraiserController'
      })
      .when('/donate/:fundraiser_id', {
        templateUrl: 'donation.html',
        controller: 'DonationController'
      })
      .when('/search', {
        templateUrl: 'search.html',
        controller: 'SearchController'
      })
      .otherwise({
        redirectTo: '/home'
      });
  }]);
