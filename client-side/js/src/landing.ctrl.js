var $inject = ["$scope", "$location", "Referrals"];
module.exports = function($scope, $location){

    $scope.referral = $location.search().link;

    if(!$scope.referral){
        $location.path("/");
    }

};
module.exports.$inject = $inject;