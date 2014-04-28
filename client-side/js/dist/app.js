(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $inject = ["$scope", "Referrals", "referralsCollection"];
module.exports = function($scope, Referrals, referralsCollection){

    // variables
    $scope.newReferralName = null;
    $scope.underEdition = null;
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

},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGFydHVyXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzovVXNlcnMvYXJ0dXIvR29vZ2xlIERyaXZlL2FtYmFzc2Fkb3Ivc2FtcGxlLXRhc2svY2xpZW50LXNpZGUvanMvc3JjL21haW4tcGFuZWwuY3RybC5qcyIsIkM6L1VzZXJzL2FydHVyL0dvb2dsZSBEcml2ZS9hbWJhc3NhZG9yL3NhbXBsZS10YXNrL2NsaWVudC1zaWRlL2pzL3NyYy9tYWluLmpzIiwiQzovVXNlcnMvYXJ0dXIvR29vZ2xlIERyaXZlL2FtYmFzc2Fkb3Ivc2FtcGxlLXRhc2svY2xpZW50LXNpZGUvanMvc3JjL3JlZmVycmFscy1tb2NrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciAkaW5qZWN0ID0gW1wiJHNjb3BlXCIsIFwiUmVmZXJyYWxzXCIsIFwicmVmZXJyYWxzQ29sbGVjdGlvblwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkc2NvcGUsIFJlZmVycmFscywgcmVmZXJyYWxzQ29sbGVjdGlvbil7XHJcblxyXG4gICAgLy8gdmFyaWFibGVzXHJcbiAgICAkc2NvcGUubmV3UmVmZXJyYWxOYW1lID0gbnVsbDtcclxuICAgICRzY29wZS51bmRlckVkaXRpb24gPSBudWxsO1xyXG4gICAgJHNjb3BlLnJlZmVycmFscyA9IHJlZmVycmFsc0NvbGxlY3Rpb247XHJcblxyXG4gICAgLy9wdWJsaWMgbWV0aG9kc1xyXG4gICAgJHNjb3BlLnJlZnJlc2ggPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFJlZmVycmFscy5hbGwoKS50aGVuKFxyXG4gICAgICAgICAgICBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgICRzY29wZS5yZWZlcnJhbHMgPSBkYXRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuYWRkID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBSZWZlcnJhbHMucG9zdCgkc2NvcGUubmV3UmVmZXJyYWxOYW1lKTtcclxuICAgICAgICAkc2NvcGUubmV3UmVmZXJyYWxOYW1lID0gbnVsbDtcclxuICAgICAgICAkc2NvcGUudW5kZXJFZGl0aW9uID0gbnVsbDtcclxuICAgICAgICAkc2NvcGUucmVmcmVzaCgpO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5yZW1vdmUgPSBmdW5jdGlvbihpZCl7XHJcbiAgICAgICAgUmVmZXJyYWxzW1wiZGVsZXRlXCJdKGlkKTtcclxuICAgICAgICAkc2NvcGUucmVmcmVzaCgpO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS51cGRhdGUgPSBmdW5jdGlvbihyZWZlcnJhbCwgdXBkYXRlTmFtZSl7XHJcbiAgICAgICAgcmVmZXJyYWwubmFtZSA9IHVwZGF0ZU5hbWU7XHJcbiAgICAgICAgUmVmZXJyYWxzLnVwZGF0ZSgpO1xyXG4gICAgICAgICRzY29wZS5yZWZyZXNoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLnNldFVuZGVyRWRpdGlvbiA9IGZ1bmN0aW9uIChyZWZlcnJhbCl7XHJcbiAgICAgICAgaWYocmVmZXJyYWwgPT09ICRzY29wZS51bmRlckVkaXRpb24pe1xyXG4gICAgICAgICAgICAkc2NvcGUudW5kZXJFZGl0aW9uID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICRzY29wZS51bmRlckVkaXRpb24gPSByZWZlcnJhbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMuJGluamVjdCA9ICRpbmplY3Q7XHJcbiIsIi8vIGl0IGFzc3VtZXMgdGhhdCBhbmd1bGFyIGlzIGxvYWRlZCBpbmRlcGVuZGVudGx5XHJcbihmdW5jdGlvbigpe1xyXG5cclxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZShcImFtYkFwcFwiLCBbXCJuZ1JvdXRlXCJdKTtcclxuXHJcbiAgICBhcHAuY29udHJvbGxlcihcIk1haW5QYW5lbEN0cmxcIiwgcmVxdWlyZShcIi4vbWFpbi1wYW5lbC5jdHJsLmpzXCIpKTtcclxuXHJcbiAgICBhcHAuZmFjdG9yeShcIlJlZmVycmFsc1wiLCByZXF1aXJlKFwiLi9yZWZlcnJhbHMtbW9jay5qc1wiKSk7IC8vIGNhbiBiZSBlYXNpbHkgc3Vic3RpdHV0ZWQgdG8gcHJvcGVyIG9iamVjdFxyXG5cclxuICAgIGFwcC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpe1xyXG5cclxuICAgICAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgICAgICAud2hlbignLycsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2h0bWwvbWFpbi1wYW5lbC50bXAuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWFpblBhbmVsQ3RybCcsXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlIDoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwicmVmZXJyYWxzQ29sbGVjdGlvblwiIDogZnVuY3Rpb24oUmVmZXJyYWxzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlZmVycmFscy5hbGwoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAub3RoZXJ3aXNlKHtyZWRpcmVjdFRvOicvJ30pO1xyXG4gICAgfSk7XHJcblxyXG59KSgpXHJcbiIsInZhciAkaW5qZWN0ID0gW1wiJHFcIiwgXCIkdGltZW91dFwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkcSwgJHRpbWVvdXQpe1xyXG5cclxuICAgIHZhciByZWZlcnJhbHMgPSBudWxsO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluY3JlYXNlQ291bnRlcihyZWZlcnJhbCl7XHJcbiAgICAgICAgcmVmZXJyYWwuY291bnRlciA9IHJlZmVycmFsLmNvdW50ZXIgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqNSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIHJlYWRBbGwoKXtcclxuICAgICAgICByZWZlcnJhbHMgPSBKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInJlZmVycmFsc1wiKSk7XHJcbiAgICAgICAgaWYoIXJlZmVycmFscyl7XHJcbiAgICAgICAgICAgIHJlZmVycmFscyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZWZlcnJhbHMuZm9yRWFjaChpbmNyZWFzZUNvdW50ZXIpO1xyXG4gICAgICAgIHdyaXRlQWxsKCk7XHJcbiAgICAgICAgcmV0dXJuIHJlZmVycmFscztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB3cml0ZUFsbCgpe1xyXG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInJlZmVycmFsc1wiLCBKU09OLnN0cmluZ2lmeShyZWZlcnJhbHMpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICBhbGwgOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuXHJcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlYWRBbGwoKSk7XHJcbiAgICAgICAgICAgIH0sIE1hdGgucmFuZG9tKCkqNzUwKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHBvc3QgOiBmdW5jdGlvbihuYW1lKSB7XHJcbiAgICAgICAgICAgIHJlZmVycmFscy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGlkIDogRGF0ZS5ub3coKSxcclxuICAgICAgICAgICAgICAgIG5hbWUgOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgY291bnRlciA6IDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHdyaXRlQWxsKCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgdXBkYXRlIDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgd3JpdGVBbGwoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBcImRlbGV0ZVwiIDogZnVuY3Rpb24oaWQpe1xyXG4gICAgICAgICAgICByZWZlcnJhbHMgPSByZWZlcnJhbHMuZmlsdGVyKGZ1bmN0aW9uKHJlZmVycmFsKXtcclxuICAgICAgICAgICAgICAgcmV0dXJuIHJlZmVycmFsLmlkICE9PSBpZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHdyaXRlQWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzLiRpbmplY3QgPSAkaW5qZWN0O1xyXG4iXX0=
