var $inject = ["$scope", "Referrals", "referralsCollection"];
module.exports = function($scope, Referrals, referralsCollection){

    // variables
    $scope.newReferralName = null;
    $scope.underEdition = null;
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
        $scope.underEdition = null;
        $scope.refresh();
    }

    $scope.remove = function(id){
        Referrals["delete"](id);
        $scope.refresh();
    }

    $scope.update = function(referral, updateName){
        referral.name = updateName;
        Referrals.update();
        $scope.refresh();
    }

    $scope.setUnderEdition = function (referral){
        if(referral === $scope.underEdition){
            $scope.underEdition = null;
        }
        else {
            $scope.underEdition = referral;
        }
    }
}
module.exports.$inject = $inject;
