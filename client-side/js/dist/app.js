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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGFydHVyXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzovVXNlcnMvYXJ0dXIvR29vZ2xlIERyaXZlL2FtYmFzc2Fkb3Ivc2FtcGxlLXRhc2svY2xpZW50LXNpZGUvanMvc3JjL2xhbmRpbmcuY3RybC5qcyIsIkM6L1VzZXJzL2FydHVyL0dvb2dsZSBEcml2ZS9hbWJhc3NhZG9yL3NhbXBsZS10YXNrL2NsaWVudC1zaWRlL2pzL3NyYy9tYWluLXBhbmVsLmN0cmwuanMiLCJDOi9Vc2Vycy9hcnR1ci9Hb29nbGUgRHJpdmUvYW1iYXNzYWRvci9zYW1wbGUtdGFzay9jbGllbnQtc2lkZS9qcy9zcmMvbWFpbi5qcyIsIkM6L1VzZXJzL2FydHVyL0dvb2dsZSBEcml2ZS9hbWJhc3NhZG9yL3NhbXBsZS10YXNrL2NsaWVudC1zaWRlL2pzL3NyYy9yZWZlcnJhbHMtbW9jay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyICRpbmplY3QgPSBbXCIkc2NvcGVcIiwgXCIkbG9jYXRpb25cIiwgXCJSZWZlcnJhbHNcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24pe1xyXG5cclxuICAgICRzY29wZS5yZWZlcnJhbCA9ICRsb2NhdGlvbi5zZWFyY2goKS5saW5rO1xyXG5cclxuICAgIGlmKCEkc2NvcGUucmVmZXJyYWwpe1xyXG4gICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcclxuICAgIH1cclxuXHJcbn07XHJcbm1vZHVsZS5leHBvcnRzLiRpbmplY3QgPSAkaW5qZWN0OyIsInZhciAkaW5qZWN0ID0gW1wiJHNjb3BlXCIsIFwiUmVmZXJyYWxzXCIsIFwicmVmZXJyYWxzQ29sbGVjdGlvblwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkc2NvcGUsIFJlZmVycmFscywgcmVmZXJyYWxzQ29sbGVjdGlvbil7XHJcblxyXG4gICAgLy8gdmFyaWFibGVzXHJcbiAgICAkc2NvcGUubmV3UmVmZXJyYWxOYW1lID0gbnVsbDtcclxuICAgICRzY29wZS51bmRlckVkaXRpb24gPSBudWxsO1xyXG4gICAgJHNjb3BlLnJlZmVycmFscyA9IHJlZmVycmFsc0NvbGxlY3Rpb247XHJcblxyXG4gICAgLy9wdWJsaWMgbWV0aG9kc1xyXG4gICAgJHNjb3BlLnJlZnJlc2ggPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFJlZmVycmFscy5hbGwoKS50aGVuKFxyXG4gICAgICAgICAgICBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgICRzY29wZS5yZWZlcnJhbHMgPSBkYXRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuYWRkID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBSZWZlcnJhbHMucG9zdCgkc2NvcGUubmV3UmVmZXJyYWxOYW1lKTtcclxuICAgICAgICAkc2NvcGUubmV3UmVmZXJyYWxOYW1lID0gbnVsbDtcclxuICAgICAgICAkc2NvcGUudW5kZXJFZGl0aW9uID0gbnVsbDtcclxuICAgICAgICAkc2NvcGUucmVmcmVzaCgpO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5yZW1vdmUgPSBmdW5jdGlvbihpZCl7XHJcbiAgICAgICAgUmVmZXJyYWxzW1wiZGVsZXRlXCJdKGlkKTtcclxuICAgICAgICAkc2NvcGUucmVmcmVzaCgpO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS51cGRhdGUgPSBmdW5jdGlvbihyZWZlcnJhbCwgdXBkYXRlTmFtZSl7XHJcbiAgICAgICAgcmVmZXJyYWwubmFtZSA9IHVwZGF0ZU5hbWU7XHJcbiAgICAgICAgUmVmZXJyYWxzLnVwZGF0ZSgpO1xyXG4gICAgICAgICRzY29wZS5yZWZyZXNoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLnNldFVuZGVyRWRpdGlvbiA9IGZ1bmN0aW9uIChyZWZlcnJhbCl7XHJcbiAgICAgICAgaWYocmVmZXJyYWwgPT09ICRzY29wZS51bmRlckVkaXRpb24pe1xyXG4gICAgICAgICAgICAkc2NvcGUudW5kZXJFZGl0aW9uID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICRzY29wZS51bmRlckVkaXRpb24gPSByZWZlcnJhbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMuJGluamVjdCA9ICRpbmplY3Q7XHJcbiIsIi8vIGl0IGFzc3VtZXMgdGhhdCBhbmd1bGFyIGlzIGxvYWRlZCBpbmRlcGVuZGVudGx5XHJcbihmdW5jdGlvbigpe1xyXG5cclxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZShcImFtYkFwcFwiLCBbXCJuZ1JvdXRlXCJdKTtcclxuXHJcbiAgICBhcHAuY29udHJvbGxlcihcIk1haW5QYW5lbEN0cmxcIiwgcmVxdWlyZShcIi4vbWFpbi1wYW5lbC5jdHJsLmpzXCIpKTtcclxuICAgIGFwcC5jb250cm9sbGVyKFwiTGFuZGluZ0N0cmxcIiwgcmVxdWlyZShcIi4vbGFuZGluZy5jdHJsLmpzXCIpKTtcclxuXHJcbiAgICBhcHAuZmFjdG9yeShcIlJlZmVycmFsc1wiLCByZXF1aXJlKFwiLi9yZWZlcnJhbHMtbW9jay5qc1wiKSk7IC8vIGNhbiBiZSBlYXNpbHkgc3Vic3RpdHV0ZWQgdG8gcHJvcGVyIG9iamVjdFxyXG5cclxuICAgIGFwcC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKXtcclxuXHJcbiAgICAgICAgJHJvdXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLndoZW4oJy8nLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9odG1sL21haW4tcGFuZWwudG1wLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01haW5QYW5lbEN0cmwnLFxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSA6IHtcclxuICAgICAgICAgICAgICAgICAgICBcInJlZmVycmFsc0NvbGxlY3Rpb25cIiA6IGZ1bmN0aW9uKFJlZmVycmFscyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBSZWZlcnJhbHMuYWxsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSAud2hlbignL2xhbmRpbmcnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9odG1sL2xhbmRpbmcudG1wLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xhbmRpbmdDdHJsJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignLzpyZWZlcnJhbCcsIHtcclxuICAgICAgICAgICAgICAgIHJlZGlyZWN0VG86IGZ1bmN0aW9uKHBhcmFtcyl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcvbGFuZGluZz9saW5rPScgKyB3aW5kb3cuZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtcy5yZWZlcnJhbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vdGhlcndpc2Uoe3JlZGlyZWN0VG86Jy8nfSk7XHJcblxyXG4gICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcclxuICAgIH0pO1xyXG5cclxufSkoKVxyXG4iLCJ2YXIgJGluamVjdCA9IFtcIiRxXCIsIFwiJHRpbWVvdXRcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHEsICR0aW1lb3V0KXtcclxuXHJcbiAgICB2YXIgcmVmZXJyYWxzID0gbnVsbDtcclxuXHJcbiAgICBmdW5jdGlvbiBpbmNyZWFzZUNvdW50ZXIocmVmZXJyYWwpe1xyXG4gICAgICAgIHJlZmVycmFsLmNvdW50ZXIgPSByZWZlcnJhbC5jb3VudGVyICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjUpO1xyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiByZWFkQWxsKCl7XHJcbiAgICAgICAgcmVmZXJyYWxzID0gSlNPTi5wYXJzZSh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJyZWZlcnJhbHNcIikpO1xyXG4gICAgICAgIGlmKCFyZWZlcnJhbHMpe1xyXG4gICAgICAgICAgICByZWZlcnJhbHMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVmZXJyYWxzLmZvckVhY2goaW5jcmVhc2VDb3VudGVyKTtcclxuICAgICAgICB3cml0ZUFsbCgpO1xyXG4gICAgICAgIHJldHVybiByZWZlcnJhbHM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gd3JpdGVBbGwoKXtcclxuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJyZWZlcnJhbHNcIiwgSlNPTi5zdHJpbmdpZnkocmVmZXJyYWxzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgYWxsIDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcblxyXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZWFkQWxsKCkpO1xyXG4gICAgICAgICAgICB9LCBNYXRoLnJhbmRvbSgpKjc1MCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBwb3N0IDogZnVuY3Rpb24obmFtZSkge1xyXG4gICAgICAgICAgICByZWZlcnJhbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBpZCA6IERhdGUubm93KCksXHJcbiAgICAgICAgICAgICAgICBuYW1lIDogbmFtZSxcclxuICAgICAgICAgICAgICAgIGNvdW50ZXIgOiAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB3cml0ZUFsbCgpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHVwZGF0ZSA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHdyaXRlQWxsKCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgXCJkZWxldGVcIiA6IGZ1bmN0aW9uKGlkKXtcclxuICAgICAgICAgICAgcmVmZXJyYWxzID0gcmVmZXJyYWxzLmZpbHRlcihmdW5jdGlvbihyZWZlcnJhbCl7XHJcbiAgICAgICAgICAgICAgIHJldHVybiByZWZlcnJhbC5pZCAhPT0gaWQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB3cml0ZUFsbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gJGluamVjdDtcclxuIl19
