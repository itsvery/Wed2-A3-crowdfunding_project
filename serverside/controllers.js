angular.module('fundraiserApp')
.controller('FundraiserController', function(FundraiserService) {
    var vm = this;
    vm.fundraisers = [];
    vm.newFundraiser = {};
    vm.currentFundraiser = {};
    vm.editing = false;

    // Load all fundraisers
    vm.loadFundraisers = function() {
        FundraiserService.getFundraisers().then(function(response) {
            vm.fundraisers = response.data;
        });
    };

    // Add new fundraiser
    vm.addFundraiser = function() {
        FundraiserService.addFundraiser(vm.newFundraiser).then(function() {
            vm.loadFundraisers();
            vm.newFundraiser = {};
        });
    };

    // Edit existing fundraiser
    vm.editFundraiser = function(fundraiser) {
        vm.currentFundraiser = angular.copy(fundraiser);
        vm.editing = true;
    };

    // Update fundraiser
    vm.updateFundraiser = function() {
        FundraiserService.updateFundraiser(vm.currentFundraiser).then(function() {
            vm.loadFundraisers();
            vm.editing = false;
        });
    };

    // Delete fundraiser
    vm.deleteFundraiser = function(id) {
        FundraiserService.deleteFundraiser(id).then(function() {
            vm.loadFundraisers();
        });
    };

    // Initialize
    vm.loadFundraisers();
});
