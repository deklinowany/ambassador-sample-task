(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $inject = ["$scope", "$location", "Referrals"];
module.exports = function($scope, $location){

    $scope.referral = $location.search().link;

    if(!$scope.referral){
        $location.path("/");
    }

};
module.exports.$inject = $inject;
},{}],2:[function(require,module,exports){
var $inject = ["$scope", "Referrals", "referralsCollection"];
module.exports = function($scope, Referrals, referralsCollection){

    // variables
    $scope.newReferralName = null;
    $scope.underEdition = null;
    $scope.referrals = referralsCollection;
    $scope.sortBy = "counter";

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

},{}],3:[function(require,module,exports){
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

},{"./landing.ctrl.js":1,"./main-panel.ctrl.js":2,"./referrals-mock.js":4}],4:[function(require,module,exports){
var $inject = ["$q", "$timeout"];
module.exports = function($q, $timeout){

    var referrals = null;

    function increaseCounter(referral){
        referral.counter = referral.counter + Math.floor(Math.random()*5);
    };

    function readAll(){
        referrals = JSON.parse(window.localStorage.getItem("referrals"));
        if(!referrals){
            referrals = [];
        }
        referrals.forEach(increaseCounter);
        writeAll();
        return referrals;
    }

    function writeAll(){
        window.localStorage.setItem("referrals", JSON.stringify(referrals));
    }

    return {

        all : function() {
            var deferred = $q.defer();

            $timeout(function(){
                deferred.resolve(readAll());
            }, Math.random()*750);

            return deferred.promise;
        },

        post : function(name) {
            referrals.push({
                id : Date.now(),
                name : name,
                counter : 0
            });
            writeAll();
        },

        update : function(){
            writeAll();
        },

        "delete" : function(id){
            referrals = referrals.filter(function(referral){
               return referral.id !== id;
            });
            writeAll();
        }
    }
}
module.exports.$inject = $inject;

},{}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGFydHVyXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzovVXNlcnMvYXJ0dXIvR29vZ2xlIERyaXZlL2FtYmFzc2Fkb3Ivc2FtcGxlLXRhc2svY2xpZW50LXNpZGUvanMvc3JjL2xhbmRpbmcuY3RybC5qcyIsIkM6L1VzZXJzL2FydHVyL0dvb2dsZSBEcml2ZS9hbWJhc3NhZG9yL3NhbXBsZS10YXNrL2NsaWVudC1zaWRlL2pzL3NyYy9tYWluLXBhbmVsLmN0cmwuanMiLCJDOi9Vc2Vycy9hcnR1ci9Hb29nbGUgRHJpdmUvYW1iYXNzYWRvci9zYW1wbGUtdGFzay9jbGllbnQtc2lkZS9qcy9zcmMvbWFpbi5qcyIsIkM6L1VzZXJzL2FydHVyL0dvb2dsZSBEcml2ZS9hbWJhc3NhZG9yL3NhbXBsZS10YXNrL2NsaWVudC1zaWRlL2pzL3NyYy9yZWZlcnJhbHMtbW9jay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgJGluamVjdCA9IFtcIiRzY29wZVwiLCBcIiRsb2NhdGlvblwiLCBcIlJlZmVycmFsc1wiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbil7XHJcblxyXG4gICAgJHNjb3BlLnJlZmVycmFsID0gJGxvY2F0aW9uLnNlYXJjaCgpLmxpbms7XHJcblxyXG4gICAgaWYoISRzY29wZS5yZWZlcnJhbCl7XHJcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvXCIpO1xyXG4gICAgfVxyXG5cclxufTtcclxubW9kdWxlLmV4cG9ydHMuJGluamVjdCA9ICRpbmplY3Q7IiwidmFyICRpbmplY3QgPSBbXCIkc2NvcGVcIiwgXCJSZWZlcnJhbHNcIiwgXCJyZWZlcnJhbHNDb2xsZWN0aW9uXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRzY29wZSwgUmVmZXJyYWxzLCByZWZlcnJhbHNDb2xsZWN0aW9uKXtcclxuXHJcbiAgICAvLyB2YXJpYWJsZXNcclxuICAgICRzY29wZS5uZXdSZWZlcnJhbE5hbWUgPSBudWxsO1xyXG4gICAgJHNjb3BlLnVuZGVyRWRpdGlvbiA9IG51bGw7XHJcbiAgICAkc2NvcGUucmVmZXJyYWxzID0gcmVmZXJyYWxzQ29sbGVjdGlvbjtcclxuICAgICRzY29wZS5zb3J0QnkgPSBcImNvdW50ZXJcIjtcclxuXHJcbiAgICAvL3B1YmxpYyBtZXRob2RzXHJcbiAgICAkc2NvcGUucmVmcmVzaCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgUmVmZXJyYWxzLmFsbCgpLnRoZW4oXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnJlZmVycmFscyA9IGRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5hZGQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFJlZmVycmFscy5wb3N0KCRzY29wZS5uZXdSZWZlcnJhbE5hbWUpO1xyXG4gICAgICAgICRzY29wZS5uZXdSZWZlcnJhbE5hbWUgPSBudWxsO1xyXG4gICAgICAgICRzY29wZS51bmRlckVkaXRpb24gPSBudWxsO1xyXG4gICAgICAgICRzY29wZS5yZWZyZXNoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLnJlbW92ZSA9IGZ1bmN0aW9uKGlkKXtcclxuICAgICAgICBSZWZlcnJhbHNbXCJkZWxldGVcIl0oaWQpO1xyXG4gICAgICAgICRzY29wZS5yZWZyZXNoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLnVwZGF0ZSA9IGZ1bmN0aW9uKHJlZmVycmFsLCB1cGRhdGVOYW1lKXtcclxuICAgICAgICByZWZlcnJhbC5uYW1lID0gdXBkYXRlTmFtZTtcclxuICAgICAgICBSZWZlcnJhbHMudXBkYXRlKCk7XHJcbiAgICAgICAgJHNjb3BlLnJlZnJlc2goKTtcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuc2V0VW5kZXJFZGl0aW9uID0gZnVuY3Rpb24gKHJlZmVycmFsKXtcclxuICAgICAgICBpZihyZWZlcnJhbCA9PT0gJHNjb3BlLnVuZGVyRWRpdGlvbil7XHJcbiAgICAgICAgICAgICRzY29wZS51bmRlckVkaXRpb24gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgJHNjb3BlLnVuZGVyRWRpdGlvbiA9IHJlZmVycmFsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gJGluamVjdDtcclxuIiwiLy8gaXQgYXNzdW1lcyB0aGF0IGFuZ3VsYXIgaXMgbG9hZGVkIGluZGVwZW5kZW50bHlcclxuKGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKFwiYW1iQXBwXCIsIFtcIm5nUm91dGVcIl0pO1xyXG5cclxuICAgIGFwcC5jb250cm9sbGVyKFwiTWFpblBhbmVsQ3RybFwiLCByZXF1aXJlKFwiLi9tYWluLXBhbmVsLmN0cmwuanNcIikpO1xyXG4gICAgYXBwLmNvbnRyb2xsZXIoXCJMYW5kaW5nQ3RybFwiLCByZXF1aXJlKFwiLi9sYW5kaW5nLmN0cmwuanNcIikpO1xyXG5cclxuICAgIGFwcC5mYWN0b3J5KFwiUmVmZXJyYWxzXCIsIHJlcXVpcmUoXCIuL3JlZmVycmFscy1tb2NrLmpzXCIpKTsgLy8gY2FuIGJlIGVhc2lseSBzdWJzdGl0dXRlZCB0byBwcm9wZXIgb2JqZWN0XHJcblxyXG4gICAgYXBwLmNvbmZpZyhmdW5jdGlvbigkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpe1xyXG5cclxuICAgICAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgICAgICAud2hlbignLycsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2h0bWwvbWFpbi1wYW5lbC50bXAuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWFpblBhbmVsQ3RybCcsXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlIDoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwicmVmZXJyYWxzQ29sbGVjdGlvblwiIDogZnVuY3Rpb24oUmVmZXJyYWxzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlZmVycmFscy5hbGwoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pIC53aGVuKCcvbGFuZGluZycsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2h0bWwvbGFuZGluZy50bXAuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTGFuZGluZ0N0cmwnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvOnJlZmVycmFsJywge1xyXG4gICAgICAgICAgICAgICAgcmVkaXJlY3RUbzogZnVuY3Rpb24ocGFyYW1zKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJy9sYW5kaW5nP2xpbms9JyArIHdpbmRvdy5lbmNvZGVVUklDb21wb25lbnQocGFyYW1zLnJlZmVycmFsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm90aGVyd2lzZSh7cmVkaXJlY3RUbzonLyd9KTtcclxuXHJcbiAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xyXG4gICAgfSk7XHJcblxyXG59KSgpXHJcbiIsInZhciAkaW5qZWN0ID0gW1wiJHFcIiwgXCIkdGltZW91dFwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkcSwgJHRpbWVvdXQpe1xyXG5cclxuICAgIHZhciByZWZlcnJhbHMgPSBudWxsO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluY3JlYXNlQ291bnRlcihyZWZlcnJhbCl7XHJcbiAgICAgICAgcmVmZXJyYWwuY291bnRlciA9IHJlZmVycmFsLmNvdW50ZXIgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqNSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIHJlYWRBbGwoKXtcclxuICAgICAgICByZWZlcnJhbHMgPSBKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInJlZmVycmFsc1wiKSk7XHJcbiAgICAgICAgaWYoIXJlZmVycmFscyl7XHJcbiAgICAgICAgICAgIHJlZmVycmFscyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZWZlcnJhbHMuZm9yRWFjaChpbmNyZWFzZUNvdW50ZXIpO1xyXG4gICAgICAgIHdyaXRlQWxsKCk7XHJcbiAgICAgICAgcmV0dXJuIHJlZmVycmFscztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB3cml0ZUFsbCgpe1xyXG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInJlZmVycmFsc1wiLCBKU09OLnN0cmluZ2lmeShyZWZlcnJhbHMpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICBhbGwgOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuXHJcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlYWRBbGwoKSk7XHJcbiAgICAgICAgICAgIH0sIE1hdGgucmFuZG9tKCkqNzUwKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHBvc3QgOiBmdW5jdGlvbihuYW1lKSB7XHJcbiAgICAgICAgICAgIHJlZmVycmFscy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGlkIDogRGF0ZS5ub3coKSxcclxuICAgICAgICAgICAgICAgIG5hbWUgOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgY291bnRlciA6IDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHdyaXRlQWxsKCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgdXBkYXRlIDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgd3JpdGVBbGwoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBcImRlbGV0ZVwiIDogZnVuY3Rpb24oaWQpe1xyXG4gICAgICAgICAgICByZWZlcnJhbHMgPSByZWZlcnJhbHMuZmlsdGVyKGZ1bmN0aW9uKHJlZmVycmFsKXtcclxuICAgICAgICAgICAgICAgcmV0dXJuIHJlZmVycmFsLmlkICE9PSBpZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHdyaXRlQWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzLiRpbmplY3QgPSAkaW5qZWN0O1xyXG4iXX0=
