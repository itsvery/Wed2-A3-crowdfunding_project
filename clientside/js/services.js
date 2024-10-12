angular.module('crowdfundingApp')
  .factory('FundraiserService', ['$http', function($http) {
    const apiUrl = 'http://localhost:3000';

    return {
      getFundraisers: function() {
        return $http.get(`${apiUrl}/fundraisers`);
      },
      getFundraiser: function(id) {
        return $http.get(`${apiUrl}/fundraiser/${id}`);
      },
      addDonation: function(donation) {
        return $http.post(`${apiUrl}/donations`, donation);
      },
      searchFundraisers: function(query) {
        return $http.get(`${apiUrl}/search`, { params: query });
      }
    };
  }]);
