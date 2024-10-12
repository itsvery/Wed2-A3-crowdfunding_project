var app = angular.module('crowdfundingApp', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeController'
    })
    .when('/fundraiser/:id', {
      templateUrl: 'views/fundraiser.html',
      controller: 'FundraiserController'
    })
    .when('/donation', {
      templateUrl: 'views/donation.html',
      controller: 'DonationController'
    })
    .when('/search', {
      templateUrl: 'views/search.html',
      controller: 'SearchController'
    })
    .otherwise({
      redirectTo: '/'
    });
});
