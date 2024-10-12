angular.module('adminApp', [])
  .controller('AdminController', function($scope, $http) {
    $scope.fundraisers = [];
    $scope.newFundraiser = {};
    $scope.currentFundraiser = {};
    $scope.editing = false;

    // Load all fundraisers
    $scope.loadFundraisers = function() {
      $http.get('/fundraisers')
        .then(function(response) {
          $scope.fundraisers = response.data;
        }, function(error) {
          console.error('Error fetching fundraisers:', error);
        });
    };

    // Add a new fundraiser
    $scope.addFundraiser = function() {
      $http.post('/fundraisers', $scope.newFundraiser)
        .then(function(response) {
          $scope.fundraisers.push(response.data);
          $scope.newFundraiser = {}; // Reset form
        }, function(error) {
          console.error('Error adding fundraiser:', error);
        });
    };

    // Edit a fundraiser
    $scope.editFundraiser = function(fundraiser) {
      $scope.currentFundraiser = angular.copy(fundraiser);
      $scope.editing = true;
    };

    // Update a fundraiser
    $scope.updateFundraiser = function() {
      $http.put('/fundraisers/' + $scope.currentFundraiser.FUNDRAISER_ID, $scope.currentFundraiser)
        .then(function(response) {
          $scope.loadFundraisers(); // Refresh list
          $scope.editing = false;
        }, function(error) {
          console.error('Error updating fundraiser:', error);
        });
    };

    // Delete a fundraiser
    $scope.deleteFundraiser = function(id) {
      $http.delete('/fundraisers/' + id)
        .then(function(response) {
          $scope.loadFundraisers(); // Refresh list
        }, function(error) {
          console.error('Error deleting fundraiser:', error);
        });
    };

    // Initialize by loading fundraisers
    $scope.loadFundraisers();
  });
