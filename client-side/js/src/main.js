// it assumes that angular is loaded independently
(function(){

    var app = angular.module("ambApp", ["ngRoute"]);

    app.controller("MainPanelCtrl", require("./main-panel.ctrl.js"));

    app.config(function($routeProvider){

        $routeProvider
            .when('/', {
                templateUrl: '/html/main-panel.tmp.html',
                controller: 'MainPanelCtrl'
            })

            .otherwise({redirectTo:'/'});
    });

})()
