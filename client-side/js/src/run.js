var $inject = ["$rootScope","$location", "busyNotifier"];
module.exports = function($rootScope, $location, busyNotifier){

    $rootScope.busyNotifier = busyNotifier;

    $rootScope.$on("$routeChangeError", function(){
        $location.path("/");
    });

};
module.exports.$inject = $inject;
