app.controller('SearchController', function($scope, $http) {
    $scope.searchCriteria = {};
  
    $scope.searchFundraisers = function() {
      var query = '?';
      if ($scope.searchCriteria.organizer) query += 'organizer=' + $scope.searchCriteria.organizer + '&';
      if ($scope.searchCriteria.city) query += 'city=' + $scope.searchCriteria.city + '&';
      if ($scope.searchCriteria.category) query += 'category=' + $scope.searchCriteria.category + '&';
  
      $http.get('/search' + query).then(function(response) {
        $scope.fundraisers = response.data;
        if ($scope.fundraisers.length === 0) {
          $scope.errorMessage = 'No fundraisers found.';
        } else {
          $scope.errorMessage = '';
        }
      });
    };
  
    $scope.clearCheckboxes = function() {
      $scope.searchCriteria = {};
    };
  });
  