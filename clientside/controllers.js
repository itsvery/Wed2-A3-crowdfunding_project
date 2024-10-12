app.controller('HomeController', function($scope, $http) {
    $http.get('http://localhost:3000/fundraisers')
      .then(function(response) {
        $scope.fundraisers = response.data;
      }, function(error) {
        console.error('Error fetching fundraisers:', error);
      });
  });

// app.controller('HomeController', function($scope, $http) {
//     $http.get('http://localhost:3000/fundraisers').then(function(response) {
//         $scope.fundraisers = response.data;
//     }).catch(function(error) {
//         console.error('Error fetching fundraisers:', error);
//     });
// });

  
  app.controller('FundraiserController', function($scope, $http, $routeParams) {
    var fundraiserId = $routeParams.id;
    $http.get(`http://localhost:3000/fundraiser/${fundraiserId}`)
      .then(function(response) {
        $scope.fundraiser = response.data;
      }, function(error) {
        console.error('Error fetching fundraiser details:', error);
      });
  });
  
  app.controller('DonationController', function($scope, $http, $routeParams) {
    var fundraiserId = $routeParams.fundraiser_id;
    $http.get(`http://localhost:3000/fundraiser/${fundraiserId}`)
      .then(function(response) {
        $scope.fundraiser = response.data;
      }, function(error) {
        console.error('Error fetching fundraiser details:', error);
      });
  
    $scope.submitDonation = function() {
      if ($scope.amount < 5) {
        alert('The minimum donation amount is 5 AUD.');
        return;
      }
  
      var donationData = {
        DATE: new Date().toISOString(),
        AMOUNT: $scope.amount,
        GIVER: $scope.giver,
        FUNDRAISER_ID: fundraiserId
      };
  
      $http.post('http://localhost:3000/donations', donationData)
        .then(function(response) {
          alert(`Thank you for your donation to ${response.data.message}`);
          window.location.href = `#/fundraiser/${fundraiserId}`;
        }, function(error) {
          console.error('Error submitting donation:', error);
        });
    };
  });
  
  app.controller('SearchController', function($scope, $http) {
    $scope.searchFundraisers = function() {
      var query = '?';
      if ($scope.organizer) query += `organizer=${$scope.organizer}&`;
      if ($scope.city) query += `city=${$scope.city}&`;
      if ($scope.category) query += `category=${$scope.category}&`;
  
      $http.get(`http://localhost:3000/search${query}`)
        .then(function(response) {
          $scope.searchResults = response.data;
        }, function(error) {
          console.error('Error searching fundraisers:', error);
        });
    };
  
    $scope.clearSearch = function() {
      $scope.organizer = '';
      $scope.city = '';
      $scope.category = '';
      $scope.searchResults = [];
    };
  });
  