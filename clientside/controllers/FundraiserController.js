app.controller('FundraiserController', function($scope, $http, $routeParams) {
    var fundraiserId = $routeParams.id;
    $http.get('/fundraiser/' + fundraiserId).then(function(response) {
      $scope.fundraiser = response.data;
    });
  });
  