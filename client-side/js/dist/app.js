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

        }
    }
}
module.exports.$inject = $inject;

},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGFydHVyXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzovVXNlcnMvYXJ0dXIvR29vZ2xlIERyaXZlL2FtYmFzc2Fkb3Ivc2FtcGxlLXRhc2svY2xpZW50LXNpZGUvanMvc3JjL21haW4tcGFuZWwuY3RybC5qcyIsIkM6L1VzZXJzL2FydHVyL0dvb2dsZSBEcml2ZS9hbWJhc3NhZG9yL3NhbXBsZS10YXNrL2NsaWVudC1zaWRlL2pzL3NyYy9tYWluLmpzIiwiQzovVXNlcnMvYXJ0dXIvR29vZ2xlIERyaXZlL2FtYmFzc2Fkb3Ivc2FtcGxlLXRhc2svY2xpZW50LXNpZGUvanMvc3JjL3JlZmVycmFscy1tb2NrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciAkaW5qZWN0ID0gW1wiJHNjb3BlXCIsIFwiUmVmZXJyYWxzXCIsIFwicmVmZXJyYWxzQ29sbGVjdGlvblwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkc2NvcGUsIFJlZmVycmFscywgcmVmZXJyYWxzQ29sbGVjdGlvbil7XHJcblxyXG4gICAgLy8gdmFyaWFibGVzXHJcbiAgICAkc2NvcGUubmV3UmVmZXJyYWxOYW1lID0gbnVsbDtcclxuICAgICRzY29wZS5yZWZlcnJhbHMgPSByZWZlcnJhbHNDb2xsZWN0aW9uO1xyXG5cclxuICAgIC8vcHVibGljIG1ldGhvZHNcclxuICAgICRzY29wZS5yZWZyZXNoID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBSZWZlcnJhbHMuYWxsKCkudGhlbihcclxuICAgICAgICAgICAgZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUucmVmZXJyYWxzID0gZGF0YTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLmFkZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgUmVmZXJyYWxzLnBvc3QoJHNjb3BlLm5ld1JlZmVycmFsTmFtZSk7XHJcbiAgICAgICAgJHNjb3BlLm5ld1JlZmVycmFsTmFtZSA9IG51bGw7XHJcbiAgICAgICAgJHNjb3BlLnJlZnJlc2goKTtcclxuICAgIH1cclxuXHJcbn1cclxubW9kdWxlLmV4cG9ydHMuJGluamVjdCA9ICRpbmplY3Q7XHJcbiIsIi8vIGl0IGFzc3VtZXMgdGhhdCBhbmd1bGFyIGlzIGxvYWRlZCBpbmRlcGVuZGVudGx5XHJcbihmdW5jdGlvbigpe1xyXG5cclxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZShcImFtYkFwcFwiLCBbXCJuZ1JvdXRlXCJdKTtcclxuXHJcbiAgICBhcHAuY29udHJvbGxlcihcIk1haW5QYW5lbEN0cmxcIiwgcmVxdWlyZShcIi4vbWFpbi1wYW5lbC5jdHJsLmpzXCIpKTtcclxuXHJcbiAgICBhcHAuZmFjdG9yeShcIlJlZmVycmFsc1wiLCByZXF1aXJlKFwiLi9yZWZlcnJhbHMtbW9jay5qc1wiKSk7IC8vIGNhbiBiZSBlYXNpbHkgc3Vic3RpdHV0ZWQgdG8gcHJvcGVyIG9iamVjdFxyXG5cclxuICAgIGFwcC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpe1xyXG5cclxuICAgICAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgICAgICAud2hlbignLycsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2h0bWwvbWFpbi1wYW5lbC50bXAuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWFpblBhbmVsQ3RybCcsXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlIDoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwicmVmZXJyYWxzQ29sbGVjdGlvblwiIDogZnVuY3Rpb24oUmVmZXJyYWxzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlZmVycmFscy5hbGwoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAub3RoZXJ3aXNlKHtyZWRpcmVjdFRvOicvJ30pO1xyXG4gICAgfSk7XHJcblxyXG59KSgpXHJcbiIsInZhciAkaW5qZWN0ID0gW1wiJHFcIiwgXCIkdGltZW91dFwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkcSwgJHRpbWVvdXQpe1xyXG5cclxuICAgIHZhciByZWZlcnJhbHMgPSBudWxsO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJlYWRBbGwoKXtcclxuICAgICAgICByZWZlcnJhbHMgPSBKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInJlZmVycmFsc1wiKSk7XHJcbiAgICAgICAgaWYoIXJlZmVycmFscyl7XHJcbiAgICAgICAgICAgIHJlZmVycmFscyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVmZXJyYWxzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHdyaXRlQWxsKCl7XHJcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicmVmZXJyYWxzXCIsIEpTT04uc3RyaW5naWZ5KHJlZmVycmFscykpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcblxyXG4gICAgICAgIGFsbCA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG5cclxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVhZEFsbCgpKTtcclxuICAgICAgICAgICAgfSwgTWF0aC5yYW5kb20oKSo3NTApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgcG9zdCA6IGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgICAgICAgICAgcmVmZXJyYWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgaWQgOiBEYXRlLm5vdygpLFxyXG4gICAgICAgICAgICAgICAgbmFtZSA6IG5hbWUsXHJcbiAgICAgICAgICAgICAgICBjb3VudGVyIDogMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgd3JpdGVBbGwoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB1cGRhdGUgOiBmdW5jdGlvbihyZWZlcnJhbCl7XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIFwiZGVsZXRlXCIgOiBmdW5jdGlvbihpZCl7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gJGluamVjdDtcclxuIl19
