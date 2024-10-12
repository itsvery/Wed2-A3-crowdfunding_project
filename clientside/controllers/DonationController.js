app.controller('DonationController', function($scope, $http, $location) {
  $scope.submitDonation = function() {
    if ($scope.donation.amount < 5) {
      alert('The minimum donation amount is 5 AUD.');
      return;
    }
    $http.post('http://localhost:3000/donations', $scope.donation).then(function(response) {
      alert('Thank you for your donation to ' + $scope.donation.fundraiser_name);
      $location.path('/fundraiser/' + $scope.donation.fundraiser_id);
    });
  };
});
