var $inject = ["$scope"];
module.exports = function($scope){

    $scope.referrals = [
        {
            name : "wolverines",
            counter : 12
        },
        {
            name : "spartans",
            counter : 8
        },
        {
            name : "spiders",
            counter : 14
        }
    ]

}
module.exports.$inject = $inject;
