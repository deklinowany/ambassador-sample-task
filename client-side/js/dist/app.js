(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $inject = ["$scope", "Referrals", "referralsCollection"];
module.exports = function($scope, Referrals, referralsCollection){

    // variables
    $scope.newReferralName = null;
    $scope.referrals = referralsCollection;

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
        $scope.refresh();
    }

    $scope.remove = function(id){
        Referrals["delete"](id);
        $scope.refresh();
    }

}
module.exports.$inject = $inject;

},{}],2:[function(require,module,exports){
// it assumes that angular is loaded independently
(function(){

    var app = angular.module("ambApp", ["ngRoute"]);

    app.controller("MainPanelCtrl", require("./main-panel.ctrl.js"));

    app.factory("Referrals", require("./referrals-mock.js")); // can be easily substituted to proper object

    app.config(function($routeProvider){

        $routeProvider
            .when('/', {
                templateUrl: '/html/main-panel.tmp.html',
                controller: 'MainPanelCtrl',
                resolve : {
                    "referralsCollection" : function(Referrals){
                        return Referrals.all();
                    }
                }
            })

            .otherwise({redirectTo:'/'});
    });

})()

},{"./main-panel.ctrl.js":1,"./referrals-mock.js":3}],3:[function(require,module,exports){
var $inject = ["$q", "$timeout"];
module.exports = function($q, $timeout){

    var referrals = null;

    function readAll(){
        referrals = JSON.parse(window.localStorage.getItem("referrals"));
        if(!referrals){
            referrals = [];
        }
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

        update : function(referral){

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

},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGFydHVyXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzovVXNlcnMvYXJ0dXIvR29vZ2xlIERyaXZlL2FtYmFzc2Fkb3Ivc2FtcGxlLXRhc2svY2xpZW50LXNpZGUvanMvc3JjL21haW4tcGFuZWwuY3RybC5qcyIsIkM6L1VzZXJzL2FydHVyL0dvb2dsZSBEcml2ZS9hbWJhc3NhZG9yL3NhbXBsZS10YXNrL2NsaWVudC1zaWRlL2pzL3NyYy9tYWluLmpzIiwiQzovVXNlcnMvYXJ0dXIvR29vZ2xlIERyaXZlL2FtYmFzc2Fkb3Ivc2FtcGxlLXRhc2svY2xpZW50LXNpZGUvanMvc3JjL3JlZmVycmFscy1tb2NrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgJGluamVjdCA9IFtcIiRzY29wZVwiLCBcIlJlZmVycmFsc1wiLCBcInJlZmVycmFsc0NvbGxlY3Rpb25cIl07XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHNjb3BlLCBSZWZlcnJhbHMsIHJlZmVycmFsc0NvbGxlY3Rpb24pe1xyXG5cclxuICAgIC8vIHZhcmlhYmxlc1xyXG4gICAgJHNjb3BlLm5ld1JlZmVycmFsTmFtZSA9IG51bGw7XHJcbiAgICAkc2NvcGUucmVmZXJyYWxzID0gcmVmZXJyYWxzQ29sbGVjdGlvbjtcclxuXHJcbiAgICAvL3B1YmxpYyBtZXRob2RzXHJcbiAgICAkc2NvcGUucmVmcmVzaCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgUmVmZXJyYWxzLmFsbCgpLnRoZW4oXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnJlZmVycmFscyA9IGRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5hZGQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFJlZmVycmFscy5wb3N0KCRzY29wZS5uZXdSZWZlcnJhbE5hbWUpO1xyXG4gICAgICAgICRzY29wZS5uZXdSZWZlcnJhbE5hbWUgPSBudWxsO1xyXG4gICAgICAgICRzY29wZS5yZWZyZXNoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLnJlbW92ZSA9IGZ1bmN0aW9uKGlkKXtcclxuICAgICAgICBSZWZlcnJhbHNbXCJkZWxldGVcIl0oaWQpO1xyXG4gICAgICAgICRzY29wZS5yZWZyZXNoKCk7XHJcbiAgICB9XHJcblxyXG59XHJcbm1vZHVsZS5leHBvcnRzLiRpbmplY3QgPSAkaW5qZWN0O1xyXG4iLCIvLyBpdCBhc3N1bWVzIHRoYXQgYW5ndWxhciBpcyBsb2FkZWQgaW5kZXBlbmRlbnRseVxyXG4oZnVuY3Rpb24oKXtcclxuXHJcbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoXCJhbWJBcHBcIiwgW1wibmdSb3V0ZVwiXSk7XHJcblxyXG4gICAgYXBwLmNvbnRyb2xsZXIoXCJNYWluUGFuZWxDdHJsXCIsIHJlcXVpcmUoXCIuL21haW4tcGFuZWwuY3RybC5qc1wiKSk7XHJcblxyXG4gICAgYXBwLmZhY3RvcnkoXCJSZWZlcnJhbHNcIiwgcmVxdWlyZShcIi4vcmVmZXJyYWxzLW1vY2suanNcIikpOyAvLyBjYW4gYmUgZWFzaWx5IHN1YnN0aXR1dGVkIHRvIHByb3BlciBvYmplY3RcclxuXHJcbiAgICBhcHAuY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKXtcclxuXHJcbiAgICAgICAgJHJvdXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLndoZW4oJy8nLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9odG1sL21haW4tcGFuZWwudG1wLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01haW5QYW5lbEN0cmwnLFxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSA6IHtcclxuICAgICAgICAgICAgICAgICAgICBcInJlZmVycmFsc0NvbGxlY3Rpb25cIiA6IGZ1bmN0aW9uKFJlZmVycmFscyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBSZWZlcnJhbHMuYWxsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLm90aGVyd2lzZSh7cmVkaXJlY3RUbzonLyd9KTtcclxuICAgIH0pO1xyXG5cclxufSkoKVxyXG4iLCJ2YXIgJGluamVjdCA9IFtcIiRxXCIsIFwiJHRpbWVvdXRcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHEsICR0aW1lb3V0KXtcclxuXHJcbiAgICB2YXIgcmVmZXJyYWxzID0gbnVsbDtcclxuXHJcbiAgICBmdW5jdGlvbiByZWFkQWxsKCl7XHJcbiAgICAgICAgcmVmZXJyYWxzID0gSlNPTi5wYXJzZSh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJyZWZlcnJhbHNcIikpO1xyXG4gICAgICAgIGlmKCFyZWZlcnJhbHMpe1xyXG4gICAgICAgICAgICByZWZlcnJhbHMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlZmVycmFscztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB3cml0ZUFsbCgpe1xyXG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInJlZmVycmFsc1wiLCBKU09OLnN0cmluZ2lmeShyZWZlcnJhbHMpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICBhbGwgOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuXHJcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlYWRBbGwoKSk7XHJcbiAgICAgICAgICAgIH0sIE1hdGgucmFuZG9tKCkqNzUwKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHBvc3QgOiBmdW5jdGlvbihuYW1lKSB7XHJcbiAgICAgICAgICAgIHJlZmVycmFscy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGlkIDogRGF0ZS5ub3coKSxcclxuICAgICAgICAgICAgICAgIG5hbWUgOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgY291bnRlciA6IDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHdyaXRlQWxsKCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgdXBkYXRlIDogZnVuY3Rpb24ocmVmZXJyYWwpe1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBcImRlbGV0ZVwiIDogZnVuY3Rpb24oaWQpe1xyXG4gICAgICAgICAgICByZWZlcnJhbHMgPSByZWZlcnJhbHMuZmlsdGVyKGZ1bmN0aW9uKHJlZmVycmFsKXtcclxuICAgICAgICAgICAgICAgcmV0dXJuIHJlZmVycmFsLmlkICE9PSBpZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHdyaXRlQWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzLiRpbmplY3QgPSAkaW5qZWN0O1xyXG4iXX0=
