var $inject = ["$routeProvider", "$locationProvider"];
module.exports = function($routeProvider, $locationProvider){

    $routeProvider
        .when('/', {
            templateUrl: '/html/main-panel.tmp.html',
            controller: 'MainPanelCtrl',
            resolve : {
                "referralsCollection" : function(Referrals){
                    return Referrals.all();
                }
            }
        }) .when('/landing', {
            templateUrl: '/html/landing.tmp.html',
            controller: 'LandingCtrl',
            resolve: {
                "exists" : function(Referrals, $location){
                    return Referrals.exists($location.search().link);
                }
            }
        })
        .when('/:referral', {
            redirectTo: function(params){
                return '/landing?link=' + window.encodeURIComponent(params.referral);
            }
        })
        .otherwise({redirectTo:'/'});

    $locationProvider.html5Mode(true);
};
module.exports.$inject = $inject;