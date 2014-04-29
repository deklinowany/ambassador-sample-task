var $inject = ["$rootScope","$location", "busyNotifier"];
module.exports = function($rootScope, $location, busyNotifier){

    $rootScope.busyNotifier = busyNotifier;

    $rootScope.$on("$routeChangeError", function(event){
        console.log(event);
        $location.path("/");
    });

};
module.exports.$inject = $inject;
