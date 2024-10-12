app.controller('HomeController', function($scope, $http) {
  $scope.message = "Welcome to Our Crowdfunding Platform!";
  $scope.inspiringStories = "Here are some inspiring stories...";
  $scope.contactInfo = "Contact us at: contact@crowdfunding.com";

  $http.get('http://localhost:3000/fundraisers').then(function(response) {
    $scope.fundraisers = response.data;
  });
});
