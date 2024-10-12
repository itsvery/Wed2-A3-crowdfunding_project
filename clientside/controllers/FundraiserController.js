app.controller('FundraiserController', function($scope, $http, $routeParams) {
  var fundraiserId = $routeParams.id;
  $http.get('http://localhost:3000/fundraiser/' + fundraiserId).then(function(response) {
    $scope.fundraiser = response.data;
  });
});
