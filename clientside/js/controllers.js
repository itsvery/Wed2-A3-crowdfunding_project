angular.module('crowdfundingApp')
  .controller('HomeController', ['$scope', 'FundraiserService', function($scope, FundraiserService) {
    FundraiserService.getFundraisers().then(function(response) {
      $scope.fundraisers = response.data;
    }).catch(function(error) {
      console.error('Error fetching fundraisers:', error);
    });
  }])
  .controller('FundraiserController', ['$scope', '$routeParams', 'FundraiserService', function($scope, $routeParams, FundraiserService) {
    const fundraiserId = $routeParams.id;
    FundraiserService.getFundraiser(fundraiserId).then(function(response) {
      $scope.fundraiser = response.data;
    }).catch(function(error) {
      console.error('Error fetching fundraiser details:', error);
    });
  }])
  .controller('DonationController', ['$scope', '$routeParams', 'FundraiserService', function($scope, $routeParams, FundraiserService) {
    const fundraiserId = $routeParams.fundraiser_id;
    FundraiserService.getFundraiser(fundraiserId).then(function(response) {
      $scope.fundraiser = response.data;
    }).catch(function(error) {
      console.error('Error fetching fundraiser details:', error);
    });

    $scope.submitDonation = function() {
      if ($scope.amount < 5) {
        alert('The minimum donation amount is 5 AUD.');
        return;
      }

      const donation = {
        DATE: new Date().toISOString(),
        AMOUNT: $scope.amount,
        GIVER: $scope.giver,
        FUNDRAISER_ID: fundraiserId
      };

      FundraiserService.addDonation(donation).then(function(response) {
        alert(`Thank you for your donation to ${response.data.message}`);
        window.location.href = `#/fundraiser/${fundraiserId}`;
      }).catch(function(error) {
        console.error('Error submitting donation:', error);
      });
    };
  }])
  .controller('SearchController', ['$scope', 'FundraiserService', function($scope, FundraiserService) {
    $scope.searchFundraisers = function() {
      const query = {
        ORGANIZER: $scope.organizer,
        CITY: $scope.city,
        CATEGORY: $scope.category
      };

      FundraiserService.searchFundraisers(query).then(function(response) {
        $scope.searchResults = response.data;
      }).catch(function(error) {
        console.error('Error searching fundraisers:', error);
      });
    };

    $scope.clearSearch = function() {
      $scope.organizer = '';
      $scope.city = '';
      $scope.category = '';
      $scope.searchResults = [];
    };
  }]);
