// it assumes that angular is loaded independently
(function(){

    var app = angular.module("ambApp", ["ngRoute"]);

    //CONTROLLER
    app.controller("MainPanelCtrl", require("./main-panel.ctrl.js"));
    app.controller("LandingCtrl", require("./landing.ctrl.js"));

    // FACTORY
    app.factory("Referrals", require("./referrals-mock.js")); // can be easily substituted to proper object
    app.factory("busyNotifier", require("./busy-notifier.js"));

    // CONFIG & RUN
    app.config(require("./config.js"));
    app.run(require("./run.js"));
})()
