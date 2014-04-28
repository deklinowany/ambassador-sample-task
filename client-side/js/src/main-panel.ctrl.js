var $inject = ["$scope", "Referrals", "referralsCollection"];
module.exports = function($scope, Referrals, referralsCollection){

    // variables
    $scope.newReferralName = null;
    $scope.referrals = referralsCollection;

    //public methods
    $scope.refresh = function(){
        Referrals.all().then(
            function(data){
                $scope.referrals = data;
            }
        );
    }

    $scope.add = function(){
        Referrals.post($scope.newReferralName);
        $scope.newReferralName = null;
        $scope.refresh();
    }

    $scope.remove = function(id){
        Referrals["delete"](id);
        $scope.refresh();
    }

}
module.exports.$inject = $inject;
