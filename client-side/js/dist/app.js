(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $inject = ["$rootScope"];
module.exports = function($rootScope){

    var numberOfBusy = 0;

    $rootScope.$on("$routeChangeStart", function(){
        numberOfBusy = 1;
    });

    $rootScope.$on("$routeChangeSuccess", function(){
        numberOfBusy = 0;
    });

    return {
        isBusy : function(){
            return numberOfBusy > 0;
        },
        setNotBusy : function(){
            numberOfBusy -= 1;
            if(numberOfBusy < 0){
                console.warn("This should not happen");
                numberOfBusy = 0;
            }
        },
        setBusy : function(){
            numberOfBusy += 1;
        }
    }

}
module.exports.$inject = $inject;

},{}],2:[function(require,module,exports){
var $inject = ["$routeProvider", "$locationProvider"];
module.exports = function($routeProvider, $locationProvider){

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
            controller: 'LandingCtrl',
            resolve: {
                "exists" : function(Referrals, $location){
                    return Referrals.exists($location.search().link);
                }
            }
        })
        .when('/:referral', {
            redirectTo: function(params){
                return '/landing?link=' + window.encodeURIComponent(params.referral);
            }
        })
        .otherwise({redirectTo:'/'});

    $locationProvider.html5Mode(true);
};
module.exports.$inject = $inject;
},{}],3:[function(require,module,exports){
var $inject = ["$scope", "$location", "Referrals"];
module.exports = function($scope, $location){

    $scope.referral = $location.search().link;

    if(!$scope.referral){
        $location.path("/");
    }

};
module.exports.$inject = $inject;
},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./busy-notifier.js":1,"./config.js":2,"./landing.ctrl.js":3,"./main-panel.ctrl.js":4,"./referrals-mock.js":6,"./run.js":7}],6:[function(require,module,exports){
var $inject = ["$q", "$timeout", "busyNotifier"];
module.exports = function($q, $timeout, busyNotifier){

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

            busyNotifier.setBusy();

            $timeout(function(){
                busyNotifier.setNotBusy();
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
        },

        exists : function(name){
            var deferred = $q.defer();

            busyNotifier.setBusy();

            $timeout(function(){
                var exists = false;
                readAll();
                referrals.forEach(function(referral){
                   if(referral.name === name){
                       exists = true;
                   }
                });
                busyNotifier.setNotBusy();
                if(exists){
                    deferred.resolve();
                }
                else{
                    deferred.reject();
                }
            }, Math.random()*750);

            return deferred.promise;
        }

    }
}
module.exports.$inject = $inject;

},{}],7:[function(require,module,exports){
var $inject = ["$rootScope","$location", "busyNotifier"];
module.exports = function($rootScope, $location, busyNotifier){

    $rootScope.busyNotifier = busyNotifier;

    $rootScope.$on("$routeChangeError", function(event){
        console.log(event);
        $location.path("/");
    });

};
module.exports.$inject = $inject;

},{}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGFydHVyXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzovVXNlcnMvYXJ0dXIvR29vZ2xlIERyaXZlL2FtYmFzc2Fkb3Ivc2FtcGxlLXRhc2svY2xpZW50LXNpZGUvanMvc3JjL2J1c3ktbm90aWZpZXIuanMiLCJDOi9Vc2Vycy9hcnR1ci9Hb29nbGUgRHJpdmUvYW1iYXNzYWRvci9zYW1wbGUtdGFzay9jbGllbnQtc2lkZS9qcy9zcmMvY29uZmlnLmpzIiwiQzovVXNlcnMvYXJ0dXIvR29vZ2xlIERyaXZlL2FtYmFzc2Fkb3Ivc2FtcGxlLXRhc2svY2xpZW50LXNpZGUvanMvc3JjL2xhbmRpbmcuY3RybC5qcyIsIkM6L1VzZXJzL2FydHVyL0dvb2dsZSBEcml2ZS9hbWJhc3NhZG9yL3NhbXBsZS10YXNrL2NsaWVudC1zaWRlL2pzL3NyYy9tYWluLXBhbmVsLmN0cmwuanMiLCJDOi9Vc2Vycy9hcnR1ci9Hb29nbGUgRHJpdmUvYW1iYXNzYWRvci9zYW1wbGUtdGFzay9jbGllbnQtc2lkZS9qcy9zcmMvbWFpbi5qcyIsIkM6L1VzZXJzL2FydHVyL0dvb2dsZSBEcml2ZS9hbWJhc3NhZG9yL3NhbXBsZS10YXNrL2NsaWVudC1zaWRlL2pzL3NyYy9yZWZlcnJhbHMtbW9jay5qcyIsIkM6L1VzZXJzL2FydHVyL0dvb2dsZSBEcml2ZS9hbWJhc3NhZG9yL3NhbXBsZS10YXNrL2NsaWVudC1zaWRlL2pzL3NyYy9ydW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciAkaW5qZWN0ID0gW1wiJHJvb3RTY29wZVwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkcm9vdFNjb3BlKXtcclxuXHJcbiAgICB2YXIgbnVtYmVyT2ZCdXN5ID0gMDtcclxuXHJcbiAgICAkcm9vdFNjb3BlLiRvbihcIiRyb3V0ZUNoYW5nZVN0YXJ0XCIsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbnVtYmVyT2ZCdXN5ID0gMTtcclxuICAgIH0pO1xyXG5cclxuICAgICRyb290U2NvcGUuJG9uKFwiJHJvdXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIG51bWJlck9mQnVzeSA9IDA7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGlzQnVzeSA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiBudW1iZXJPZkJ1c3kgPiAwO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0Tm90QnVzeSA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIG51bWJlck9mQnVzeSAtPSAxO1xyXG4gICAgICAgICAgICBpZihudW1iZXJPZkJ1c3kgPCAwKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlRoaXMgc2hvdWxkIG5vdCBoYXBwZW5cIik7XHJcbiAgICAgICAgICAgICAgICBudW1iZXJPZkJ1c3kgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXRCdXN5IDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgbnVtYmVyT2ZCdXN5ICs9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5tb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gJGluamVjdDtcclxuIiwidmFyICRpbmplY3QgPSBbXCIkcm91dGVQcm92aWRlclwiLCBcIiRsb2NhdGlvblByb3ZpZGVyXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcil7XHJcblxyXG4gICAgJHJvdXRlUHJvdmlkZXJcclxuICAgICAgICAud2hlbignLycsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvaHRtbC9tYWluLXBhbmVsLnRtcC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ01haW5QYW5lbEN0cmwnLFxyXG4gICAgICAgICAgICByZXNvbHZlIDoge1xyXG4gICAgICAgICAgICAgICAgXCJyZWZlcnJhbHNDb2xsZWN0aW9uXCIgOiBmdW5jdGlvbihSZWZlcnJhbHMpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSZWZlcnJhbHMuYWxsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSAud2hlbignL2xhbmRpbmcnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2h0bWwvbGFuZGluZy50bXAuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMYW5kaW5nQ3RybCcsXHJcbiAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgIFwiZXhpc3RzXCIgOiBmdW5jdGlvbihSZWZlcnJhbHMsICRsb2NhdGlvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlZmVycmFscy5leGlzdHMoJGxvY2F0aW9uLnNlYXJjaCgpLmxpbmspO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignLzpyZWZlcnJhbCcsIHtcclxuICAgICAgICAgICAgcmVkaXJlY3RUbzogZnVuY3Rpb24ocGFyYW1zKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnL2xhbmRpbmc/bGluaz0nICsgd2luZG93LmVuY29kZVVSSUNvbXBvbmVudChwYXJhbXMucmVmZXJyYWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAub3RoZXJ3aXNlKHtyZWRpcmVjdFRvOicvJ30pO1xyXG5cclxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcclxufTtcclxubW9kdWxlLmV4cG9ydHMuJGluamVjdCA9ICRpbmplY3Q7IiwidmFyICRpbmplY3QgPSBbXCIkc2NvcGVcIiwgXCIkbG9jYXRpb25cIiwgXCJSZWZlcnJhbHNcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24pe1xyXG5cclxuICAgICRzY29wZS5yZWZlcnJhbCA9ICRsb2NhdGlvbi5zZWFyY2goKS5saW5rO1xyXG5cclxuICAgIGlmKCEkc2NvcGUucmVmZXJyYWwpe1xyXG4gICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcclxuICAgIH1cclxuXHJcbn07XHJcbm1vZHVsZS5leHBvcnRzLiRpbmplY3QgPSAkaW5qZWN0OyIsInZhciAkaW5qZWN0ID0gW1wiJHNjb3BlXCIsIFwiUmVmZXJyYWxzXCIsIFwicmVmZXJyYWxzQ29sbGVjdGlvblwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkc2NvcGUsIFJlZmVycmFscywgcmVmZXJyYWxzQ29sbGVjdGlvbil7XHJcblxyXG4gICAgLy8gdmFyaWFibGVzXHJcbiAgICAkc2NvcGUubmV3UmVmZXJyYWxOYW1lID0gbnVsbDtcclxuICAgICRzY29wZS51bmRlckVkaXRpb24gPSBudWxsO1xyXG4gICAgJHNjb3BlLnJlZmVycmFscyA9IHJlZmVycmFsc0NvbGxlY3Rpb247XHJcbiAgICAkc2NvcGUuc29ydEJ5ID0gXCJjb3VudGVyXCI7XHJcblxyXG4gICAgLy9wdWJsaWMgbWV0aG9kc1xyXG4gICAgJHNjb3BlLnJlZnJlc2ggPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFJlZmVycmFscy5hbGwoKS50aGVuKFxyXG4gICAgICAgICAgICBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgICRzY29wZS5yZWZlcnJhbHMgPSBkYXRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuYWRkID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBSZWZlcnJhbHMucG9zdCgkc2NvcGUubmV3UmVmZXJyYWxOYW1lKTtcclxuICAgICAgICAkc2NvcGUubmV3UmVmZXJyYWxOYW1lID0gbnVsbDtcclxuICAgICAgICAkc2NvcGUudW5kZXJFZGl0aW9uID0gbnVsbDtcclxuICAgICAgICAkc2NvcGUucmVmcmVzaCgpO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5yZW1vdmUgPSBmdW5jdGlvbihpZCl7XHJcbiAgICAgICAgUmVmZXJyYWxzW1wiZGVsZXRlXCJdKGlkKTtcclxuICAgICAgICAkc2NvcGUucmVmcmVzaCgpO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS51cGRhdGUgPSBmdW5jdGlvbihyZWZlcnJhbCwgdXBkYXRlTmFtZSl7XHJcbiAgICAgICAgcmVmZXJyYWwubmFtZSA9IHVwZGF0ZU5hbWU7XHJcbiAgICAgICAgUmVmZXJyYWxzLnVwZGF0ZSgpO1xyXG4gICAgICAgICRzY29wZS5yZWZyZXNoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLnNldFVuZGVyRWRpdGlvbiA9IGZ1bmN0aW9uIChyZWZlcnJhbCl7XHJcbiAgICAgICAgaWYocmVmZXJyYWwgPT09ICRzY29wZS51bmRlckVkaXRpb24pe1xyXG4gICAgICAgICAgICAkc2NvcGUudW5kZXJFZGl0aW9uID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICRzY29wZS51bmRlckVkaXRpb24gPSByZWZlcnJhbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMuJGluamVjdCA9ICRpbmplY3Q7XHJcbiIsIi8vIGl0IGFzc3VtZXMgdGhhdCBhbmd1bGFyIGlzIGxvYWRlZCBpbmRlcGVuZGVudGx5XHJcbihmdW5jdGlvbigpe1xyXG5cclxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZShcImFtYkFwcFwiLCBbXCJuZ1JvdXRlXCJdKTtcclxuXHJcbiAgICAvL0NPTlRST0xMRVJcclxuICAgIGFwcC5jb250cm9sbGVyKFwiTWFpblBhbmVsQ3RybFwiLCByZXF1aXJlKFwiLi9tYWluLXBhbmVsLmN0cmwuanNcIikpO1xyXG4gICAgYXBwLmNvbnRyb2xsZXIoXCJMYW5kaW5nQ3RybFwiLCByZXF1aXJlKFwiLi9sYW5kaW5nLmN0cmwuanNcIikpO1xyXG5cclxuICAgIC8vIEZBQ1RPUllcclxuICAgIGFwcC5mYWN0b3J5KFwiUmVmZXJyYWxzXCIsIHJlcXVpcmUoXCIuL3JlZmVycmFscy1tb2NrLmpzXCIpKTsgLy8gY2FuIGJlIGVhc2lseSBzdWJzdGl0dXRlZCB0byBwcm9wZXIgb2JqZWN0XHJcbiAgICBhcHAuZmFjdG9yeShcImJ1c3lOb3RpZmllclwiLCByZXF1aXJlKFwiLi9idXN5LW5vdGlmaWVyLmpzXCIpKTtcclxuXHJcbiAgICAvLyBDT05GSUcgJiBSVU5cclxuICAgIGFwcC5jb25maWcocmVxdWlyZShcIi4vY29uZmlnLmpzXCIpKTtcclxuICAgIGFwcC5ydW4ocmVxdWlyZShcIi4vcnVuLmpzXCIpKTtcclxufSkoKVxyXG4iLCJ2YXIgJGluamVjdCA9IFtcIiRxXCIsIFwiJHRpbWVvdXRcIiwgXCJidXN5Tm90aWZpZXJcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHEsICR0aW1lb3V0LCBidXN5Tm90aWZpZXIpe1xyXG5cclxuICAgIHZhciByZWZlcnJhbHMgPSBudWxsO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluY3JlYXNlQ291bnRlcihyZWZlcnJhbCl7XHJcbiAgICAgICAgcmVmZXJyYWwuY291bnRlciA9IHJlZmVycmFsLmNvdW50ZXIgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqNSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIHJlYWRBbGwoKXtcclxuICAgICAgICByZWZlcnJhbHMgPSBKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInJlZmVycmFsc1wiKSk7XHJcbiAgICAgICAgaWYoIXJlZmVycmFscyl7XHJcbiAgICAgICAgICAgIHJlZmVycmFscyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZWZlcnJhbHMuZm9yRWFjaChpbmNyZWFzZUNvdW50ZXIpO1xyXG4gICAgICAgIHdyaXRlQWxsKCk7XHJcbiAgICAgICAgcmV0dXJuIHJlZmVycmFscztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB3cml0ZUFsbCgpe1xyXG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInJlZmVycmFsc1wiLCBKU09OLnN0cmluZ2lmeShyZWZlcnJhbHMpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICBhbGwgOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuXHJcbiAgICAgICAgICAgIGJ1c3lOb3RpZmllci5zZXRCdXN5KCk7XHJcblxyXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgYnVzeU5vdGlmaWVyLnNldE5vdEJ1c3koKTtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVhZEFsbCgpKTtcclxuICAgICAgICAgICAgfSwgTWF0aC5yYW5kb20oKSo3NTApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgcG9zdCA6IGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgICAgICAgICAgcmVmZXJyYWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgaWQgOiBEYXRlLm5vdygpLFxyXG4gICAgICAgICAgICAgICAgbmFtZSA6IG5hbWUsXHJcbiAgICAgICAgICAgICAgICBjb3VudGVyIDogMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgd3JpdGVBbGwoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB1cGRhdGUgOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB3cml0ZUFsbCgpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIFwiZGVsZXRlXCIgOiBmdW5jdGlvbihpZCl7XHJcbiAgICAgICAgICAgIHJlZmVycmFscyA9IHJlZmVycmFscy5maWx0ZXIoZnVuY3Rpb24ocmVmZXJyYWwpe1xyXG4gICAgICAgICAgICAgICByZXR1cm4gcmVmZXJyYWwuaWQgIT09IGlkO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgd3JpdGVBbGwoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBleGlzdHMgOiBmdW5jdGlvbihuYW1lKXtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuXHJcbiAgICAgICAgICAgIGJ1c3lOb3RpZmllci5zZXRCdXN5KCk7XHJcblxyXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgdmFyIGV4aXN0cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgcmVhZEFsbCgpO1xyXG4gICAgICAgICAgICAgICAgcmVmZXJyYWxzLmZvckVhY2goZnVuY3Rpb24ocmVmZXJyYWwpe1xyXG4gICAgICAgICAgICAgICAgICAgaWYocmVmZXJyYWwubmFtZSA9PT0gbmFtZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgYnVzeU5vdGlmaWVyLnNldE5vdEJ1c3koKTtcclxuICAgICAgICAgICAgICAgIGlmKGV4aXN0cyl7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgTWF0aC5yYW5kb20oKSo3NTApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gJGluamVjdDtcclxuIiwidmFyICRpbmplY3QgPSBbXCIkcm9vdFNjb3BlXCIsXCIkbG9jYXRpb25cIiwgXCJidXN5Tm90aWZpZXJcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHJvb3RTY29wZSwgJGxvY2F0aW9uLCBidXN5Tm90aWZpZXIpe1xyXG5cclxuICAgICRyb290U2NvcGUuYnVzeU5vdGlmaWVyID0gYnVzeU5vdGlmaWVyO1xyXG5cclxuICAgICRyb290U2NvcGUuJG9uKFwiJHJvdXRlQ2hhbmdlRXJyb3JcIiwgZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50KTtcclxuICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XHJcbiAgICB9KTtcclxuXHJcbn07XHJcbm1vZHVsZS5leHBvcnRzLiRpbmplY3QgPSAkaW5qZWN0O1xyXG4iXX0=
