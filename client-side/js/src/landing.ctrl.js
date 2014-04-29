var $inject = ["$scope", "$location", "Referrals"];
module.exports = function($scope, $location){

    $scope.referral = $location.search().link;

    $scope.loupeConfig = {
        radius: "10vmin",
        revealTimeout: 15*1000
    }

};
module.exports.$inject = $inject;