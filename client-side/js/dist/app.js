(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{"./main-panel.ctrl.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGFydHVyXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzovVXNlcnMvYXJ0dXIvR29vZ2xlIERyaXZlL2FtYmFzc2Fkb3Ivc2FtcGxlLXRhc2svY2xpZW50LXNpZGUvanMvc3JjL21haW4tcGFuZWwuY3RybC5qcyIsIkM6L1VzZXJzL2FydHVyL0dvb2dsZSBEcml2ZS9hbWJhc3NhZG9yL3NhbXBsZS10YXNrL2NsaWVudC1zaWRlL2pzL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgJGluamVjdCA9IFtcIiRzY29wZVwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkc2NvcGUpe1xyXG5cclxuICAgICRzY29wZS5yZWZlcnJhbHMgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lIDogXCJ3b2x2ZXJpbmVzXCIsXHJcbiAgICAgICAgICAgIGNvdW50ZXIgOiAxMlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lIDogXCJzcGFydGFuc1wiLFxyXG4gICAgICAgICAgICBjb3VudGVyIDogOFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lIDogXCJzcGlkZXJzXCIsXHJcbiAgICAgICAgICAgIGNvdW50ZXIgOiAxNFxyXG4gICAgICAgIH1cclxuICAgIF1cclxuXHJcbn1cclxubW9kdWxlLmV4cG9ydHMuJGluamVjdCA9ICRpbmplY3Q7XHJcbiIsIi8vIGl0IGFzc3VtZXMgdGhhdCBhbmd1bGFyIGlzIGxvYWRlZCBpbmRlcGVuZGVudGx5XHJcbihmdW5jdGlvbigpe1xyXG5cclxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZShcImFtYkFwcFwiLCBbXCJuZ1JvdXRlXCJdKTtcclxuXHJcbiAgICBhcHAuY29udHJvbGxlcihcIk1haW5QYW5lbEN0cmxcIiwgcmVxdWlyZShcIi4vbWFpbi1wYW5lbC5jdHJsLmpzXCIpKTtcclxuXHJcbiAgICBhcHAuY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKXtcclxuXHJcbiAgICAgICAgJHJvdXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLndoZW4oJy8nLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9odG1sL21haW4tcGFuZWwudG1wLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01haW5QYW5lbEN0cmwnXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAub3RoZXJ3aXNlKHtyZWRpcmVjdFRvOicvJ30pO1xyXG4gICAgfSk7XHJcblxyXG59KSgpXHJcbiJdfQ==
