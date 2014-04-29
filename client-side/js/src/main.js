// it assumes that angular is loaded independently
(function(){

    var app = angular.module("ambApp", ["ngRoute"]);

    //CONTROLLERS
    app.controller("MainPanelCtrl", require("./main-panel.ctrl.js"));
    app.controller("LandingCtrl", require("./landing.ctrl.js"));

    // FACTORIES
    app.factory("Referrals", require("./referrals-mock.js")); // can be easily substituted to proper object
    app.factory("busyNotifier", require("./busy-notifier.js"));

    //DIRECTIVIES
    app.directive("ambLoupe", require("./amb-loupe.js"));
    app.directive("ambGetCenter", require("./amb-get-center.js"));

    // CONFIG & RUN
    app.config(require("./config.js"));
    app.run(require("./run.js"));
})()
