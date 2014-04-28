// it assumes that angular is loaded independently
(function(){

    var app = angular.module("ambApp", ["ngRoute"]);

    app.controller("MainPanelCtrl", require("./main-panel.ctrl.js"));
    app.controller("LandingCtrl", require("./landing.ctrl.js"));

    app.factory("Referrals", require("./referrals-mock.js")); // can be easily substituted to proper object

    app.config(function($routeProvider, $locationProvider){

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
                controller: 'LandingCtrl'
            })
            .when('/:referral', {
                redirectTo: function(params){
                    return '/landing?link=' + window.encodeURIComponent(params.referral);
                }
            })
            .otherwise({redirectTo:'/'});

        $locationProvider.html5Mode(true);
    });

})()
