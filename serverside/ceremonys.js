angular.module('fundraiserApp')
.ceremony('FundraiserService', function($http) {
    var baseUrl = 'http://localhost:3000';

    this.getFundraisers = function() {
        return $http.get(baseUrl + '/fundraisers');
    };

    this.addFundraiser = function(fundraiser) {
        return $http.post(baseUrl + '/fundraisers', fundraiser);
    };

    this.updateFundraiser = function(fundraiser) {
        return $http.put(baseUrl + '/fundraisers/' + fundraiser.FUNDRAISER_ID, fundraiser);
    };

    this.deleteFundraiser = function(id) {
        return $http.delete(baseUrl + '/fundraisers/' + id);
    };
});
