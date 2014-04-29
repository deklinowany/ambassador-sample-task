(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $inject = [];
module.exports = function(){

    return {
        scope : {
            "position" : "=ambGetCenter"
        },
        link : function(scope, element){
            var rect = element[0].getBoundingClientRect();
            scope.position.x = (rect.left + rect.width/2);
            scope.position.y= (rect.top + rect.height/2);
        }
    }
}
module.exports.$inject = $inject;
},{}],2:[function(require,module,exports){
var $inject = ["$interpolate", "$timeout"];
module.exports = function ($interpolate, $timeout) {

    var styleExpression = $interpolate("radial-gradient(100vmax at {{x}} {{y}} ,  rgba(0, 0, 0, 0) 0% , rgba(0, 0, 0, 1.0) {{radius}})");


    return {
        restrict: "EA",
        replace : true,
        template: "<div></div>",
        scope: {
            config: "=ambLoupeConfig"
        },
        link: function (scope, element) {

            var timer = null;

            if (!scope.config) {
                scope.config = {};
            }
            scope.config.x = scope.config.x || "0";
            scope.config.y = scope.config.y || "0";
            scope.config.radius = scope.config.radius || "10vmin";

            var backgroundUpdater = (function(radius){
                return function(x,y){
                    element[0].style["background-image"] = styleExpression({x:x+"px",y:y+"px",radius:radius});
                }
            })(scope.config.radius);

            function initElement(){
                element[0].style.width="100vw";
                element[0].style.height="100vh";
                element[0].style.position="absolute";
                element[0].style.cursor="none";
                backgroundUpdater(scope.config.x, scope.config.y);
                element[0].addEventListener("mousemove", moveHandler);
                timer = $timeout(function(){
                    element.remove()
                    }, scope.config.revealTimeout
                );
            }

            function moveHandler(event){
                backgroundUpdater(event.clientX, event.clientY);
            }

            scope.$on("$destroy", function(){
                element[0].removeEventListener("mousemove", moveHandler);
                $timeout.cancel(timer);
            });

            // INIT
            initElement();
        }
    }
}
module.exports.$inject = $inject;
},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
var $inject = ["$scope", "$location", "Referrals"];
module.exports = function($scope, $location){

    $scope.referral = $location.search().link;

    $scope.loupeConfig = {
        radius: "10vmin",
        revealTimeout: 15*1000
    }

};
module.exports.$inject = $inject;
},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{"./amb-get-center.js":1,"./amb-loupe.js":2,"./busy-notifier.js":3,"./config.js":4,"./landing.ctrl.js":5,"./main-panel.ctrl.js":6,"./referrals-mock.js":8,"./run.js":9}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
var $inject = ["$rootScope","$location", "busyNotifier"];
module.exports = function($rootScope, $location, busyNotifier){

    $rootScope.busyNotifier = busyNotifier;

    $rootScope.$on("$routeChangeError", function(){
        $location.path("/");
    });

};
module.exports.$inject = $inject;

},{}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGFydHVyXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzovVXNlcnMvYXJ0dXIvR29vZ2xlIERyaXZlL2FtYmFzc2Fkb3Ivc2FtcGxlLXRhc2svY2xpZW50LXNpZGUvanMvc3JjL2FtYi1nZXQtY2VudGVyLmpzIiwiQzovVXNlcnMvYXJ0dXIvR29vZ2xlIERyaXZlL2FtYmFzc2Fkb3Ivc2FtcGxlLXRhc2svY2xpZW50LXNpZGUvanMvc3JjL2FtYi1sb3VwZS5qcyIsIkM6L1VzZXJzL2FydHVyL0dvb2dsZSBEcml2ZS9hbWJhc3NhZG9yL3NhbXBsZS10YXNrL2NsaWVudC1zaWRlL2pzL3NyYy9idXN5LW5vdGlmaWVyLmpzIiwiQzovVXNlcnMvYXJ0dXIvR29vZ2xlIERyaXZlL2FtYmFzc2Fkb3Ivc2FtcGxlLXRhc2svY2xpZW50LXNpZGUvanMvc3JjL2NvbmZpZy5qcyIsIkM6L1VzZXJzL2FydHVyL0dvb2dsZSBEcml2ZS9hbWJhc3NhZG9yL3NhbXBsZS10YXNrL2NsaWVudC1zaWRlL2pzL3NyYy9sYW5kaW5nLmN0cmwuanMiLCJDOi9Vc2Vycy9hcnR1ci9Hb29nbGUgRHJpdmUvYW1iYXNzYWRvci9zYW1wbGUtdGFzay9jbGllbnQtc2lkZS9qcy9zcmMvbWFpbi1wYW5lbC5jdHJsLmpzIiwiQzovVXNlcnMvYXJ0dXIvR29vZ2xlIERyaXZlL2FtYmFzc2Fkb3Ivc2FtcGxlLXRhc2svY2xpZW50LXNpZGUvanMvc3JjL21haW4uanMiLCJDOi9Vc2Vycy9hcnR1ci9Hb29nbGUgRHJpdmUvYW1iYXNzYWRvci9zYW1wbGUtdGFzay9jbGllbnQtc2lkZS9qcy9zcmMvcmVmZXJyYWxzLW1vY2suanMiLCJDOi9Vc2Vycy9hcnR1ci9Hb29nbGUgRHJpdmUvYW1iYXNzYWRvci9zYW1wbGUtdGFzay9jbGllbnQtc2lkZS9qcy9zcmMvcnVuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyICRpbmplY3QgPSBbXTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc2NvcGUgOiB7XHJcbiAgICAgICAgICAgIFwicG9zaXRpb25cIiA6IFwiPWFtYkdldENlbnRlclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsaW5rIDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQpe1xyXG4gICAgICAgICAgICB2YXIgcmVjdCA9IGVsZW1lbnRbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgIHNjb3BlLnBvc2l0aW9uLnggPSAocmVjdC5sZWZ0ICsgcmVjdC53aWR0aC8yKTtcclxuICAgICAgICAgICAgc2NvcGUucG9zaXRpb24ueT0gKHJlY3QudG9wICsgcmVjdC5oZWlnaHQvMik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzLiRpbmplY3QgPSAkaW5qZWN0OyIsInZhciAkaW5qZWN0ID0gW1wiJGludGVycG9sYXRlXCIsIFwiJHRpbWVvdXRcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRpbnRlcnBvbGF0ZSwgJHRpbWVvdXQpIHtcclxuXHJcbiAgICB2YXIgc3R5bGVFeHByZXNzaW9uID0gJGludGVycG9sYXRlKFwicmFkaWFsLWdyYWRpZW50KDEwMHZtYXggYXQge3t4fX0ge3t5fX0gLCAgcmdiYSgwLCAwLCAwLCAwKSAwJSAsIHJnYmEoMCwgMCwgMCwgMS4wKSB7e3JhZGl1c319KVwiKTtcclxuXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogXCJFQVwiLFxyXG4gICAgICAgIHJlcGxhY2UgOiB0cnVlLFxyXG4gICAgICAgIHRlbXBsYXRlOiBcIjxkaXY+PC9kaXY+XCIsXHJcbiAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgY29uZmlnOiBcIj1hbWJMb3VwZUNvbmZpZ1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciB0aW1lciA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXNjb3BlLmNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuY29uZmlnID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2NvcGUuY29uZmlnLnggPSBzY29wZS5jb25maWcueCB8fCBcIjBcIjtcclxuICAgICAgICAgICAgc2NvcGUuY29uZmlnLnkgPSBzY29wZS5jb25maWcueSB8fCBcIjBcIjtcclxuICAgICAgICAgICAgc2NvcGUuY29uZmlnLnJhZGl1cyA9IHNjb3BlLmNvbmZpZy5yYWRpdXMgfHwgXCIxMHZtaW5cIjtcclxuXHJcbiAgICAgICAgICAgIHZhciBiYWNrZ3JvdW5kVXBkYXRlciA9IChmdW5jdGlvbihyYWRpdXMpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHgseSl7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudFswXS5zdHlsZVtcImJhY2tncm91bmQtaW1hZ2VcIl0gPSBzdHlsZUV4cHJlc3Npb24oe3g6eCtcInB4XCIseTp5K1wicHhcIixyYWRpdXM6cmFkaXVzfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKHNjb3BlLmNvbmZpZy5yYWRpdXMpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gaW5pdEVsZW1lbnQoKXtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRbMF0uc3R5bGUud2lkdGg9XCIxMDB2d1wiO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudFswXS5zdHlsZS5oZWlnaHQ9XCIxMDB2aFwiO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudFswXS5zdHlsZS5wb3NpdGlvbj1cImFic29sdXRlXCI7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50WzBdLnN0eWxlLmN1cnNvcj1cIm5vbmVcIjtcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRVcGRhdGVyKHNjb3BlLmNvbmZpZy54LCBzY29wZS5jb25maWcueSk7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50WzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW92ZUhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgdGltZXIgPSAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlKClcclxuICAgICAgICAgICAgICAgICAgICB9LCBzY29wZS5jb25maWcucmV2ZWFsVGltZW91dFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gbW92ZUhhbmRsZXIoZXZlbnQpe1xyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZFVwZGF0ZXIoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNjb3BlLiRvbihcIiRkZXN0cm95XCIsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50WzBdLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW92ZUhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVyKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBJTklUXHJcbiAgICAgICAgICAgIGluaXRFbGVtZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzLiRpbmplY3QgPSAkaW5qZWN0OyIsInZhciAkaW5qZWN0ID0gW1wiJHJvb3RTY29wZVwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkcm9vdFNjb3BlKXtcclxuXHJcbiAgICB2YXIgbnVtYmVyT2ZCdXN5ID0gMDtcclxuXHJcbiAgICAkcm9vdFNjb3BlLiRvbihcIiRyb3V0ZUNoYW5nZVN0YXJ0XCIsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbnVtYmVyT2ZCdXN5ID0gMTtcclxuICAgIH0pO1xyXG5cclxuICAgICRyb290U2NvcGUuJG9uKFwiJHJvdXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIG51bWJlck9mQnVzeSA9IDA7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGlzQnVzeSA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiBudW1iZXJPZkJ1c3kgPiAwO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0Tm90QnVzeSA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIG51bWJlck9mQnVzeSAtPSAxO1xyXG4gICAgICAgICAgICBpZihudW1iZXJPZkJ1c3kgPCAwKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlRoaXMgc2hvdWxkIG5vdCBoYXBwZW5cIik7XHJcbiAgICAgICAgICAgICAgICBudW1iZXJPZkJ1c3kgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXRCdXN5IDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgbnVtYmVyT2ZCdXN5ICs9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5tb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gJGluamVjdDtcclxuIiwidmFyICRpbmplY3QgPSBbXCIkcm91dGVQcm92aWRlclwiLCBcIiRsb2NhdGlvblByb3ZpZGVyXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcil7XHJcblxyXG4gICAgJHJvdXRlUHJvdmlkZXJcclxuICAgICAgICAud2hlbignLycsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvaHRtbC9tYWluLXBhbmVsLnRtcC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ01haW5QYW5lbEN0cmwnLFxyXG4gICAgICAgICAgICByZXNvbHZlIDoge1xyXG4gICAgICAgICAgICAgICAgXCJyZWZlcnJhbHNDb2xsZWN0aW9uXCIgOiBmdW5jdGlvbihSZWZlcnJhbHMpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSZWZlcnJhbHMuYWxsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSAud2hlbignL2xhbmRpbmcnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2h0bWwvbGFuZGluZy50bXAuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMYW5kaW5nQ3RybCcsXHJcbiAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgIFwiZXhpc3RzXCIgOiBmdW5jdGlvbihSZWZlcnJhbHMsICRsb2NhdGlvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlZmVycmFscy5leGlzdHMoJGxvY2F0aW9uLnNlYXJjaCgpLmxpbmspO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignLzpyZWZlcnJhbCcsIHtcclxuICAgICAgICAgICAgcmVkaXJlY3RUbzogZnVuY3Rpb24ocGFyYW1zKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnL2xhbmRpbmc/bGluaz0nICsgd2luZG93LmVuY29kZVVSSUNvbXBvbmVudChwYXJhbXMucmVmZXJyYWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAub3RoZXJ3aXNlKHtyZWRpcmVjdFRvOicvJ30pO1xyXG5cclxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcclxufTtcclxubW9kdWxlLmV4cG9ydHMuJGluamVjdCA9ICRpbmplY3Q7IiwidmFyICRpbmplY3QgPSBbXCIkc2NvcGVcIiwgXCIkbG9jYXRpb25cIiwgXCJSZWZlcnJhbHNcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24pe1xyXG5cclxuICAgICRzY29wZS5yZWZlcnJhbCA9ICRsb2NhdGlvbi5zZWFyY2goKS5saW5rO1xyXG5cclxuICAgICRzY29wZS5sb3VwZUNvbmZpZyA9IHtcclxuICAgICAgICByYWRpdXM6IFwiMTB2bWluXCIsXHJcbiAgICAgICAgcmV2ZWFsVGltZW91dDogMTUqMTAwMFxyXG4gICAgfVxyXG5cclxufTtcclxubW9kdWxlLmV4cG9ydHMuJGluamVjdCA9ICRpbmplY3Q7IiwidmFyICRpbmplY3QgPSBbXCIkc2NvcGVcIiwgXCJSZWZlcnJhbHNcIiwgXCJyZWZlcnJhbHNDb2xsZWN0aW9uXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRzY29wZSwgUmVmZXJyYWxzLCByZWZlcnJhbHNDb2xsZWN0aW9uKXtcclxuXHJcbiAgICAvLyB2YXJpYWJsZXNcclxuICAgICRzY29wZS5uZXdSZWZlcnJhbE5hbWUgPSBudWxsO1xyXG4gICAgJHNjb3BlLnVuZGVyRWRpdGlvbiA9IG51bGw7XHJcbiAgICAkc2NvcGUucmVmZXJyYWxzID0gcmVmZXJyYWxzQ29sbGVjdGlvbjtcclxuICAgICRzY29wZS5zb3J0QnkgPSBcImNvdW50ZXJcIjtcclxuXHJcbiAgICAvL3B1YmxpYyBtZXRob2RzXHJcbiAgICAkc2NvcGUucmVmcmVzaCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgUmVmZXJyYWxzLmFsbCgpLnRoZW4oXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnJlZmVycmFscyA9IGRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5hZGQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFJlZmVycmFscy5wb3N0KCRzY29wZS5uZXdSZWZlcnJhbE5hbWUpO1xyXG4gICAgICAgICRzY29wZS5uZXdSZWZlcnJhbE5hbWUgPSBudWxsO1xyXG4gICAgICAgICRzY29wZS51bmRlckVkaXRpb24gPSBudWxsO1xyXG4gICAgICAgICRzY29wZS5yZWZyZXNoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLnJlbW92ZSA9IGZ1bmN0aW9uKGlkKXtcclxuICAgICAgICBSZWZlcnJhbHNbXCJkZWxldGVcIl0oaWQpO1xyXG4gICAgICAgICRzY29wZS5yZWZyZXNoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLnVwZGF0ZSA9IGZ1bmN0aW9uKHJlZmVycmFsLCB1cGRhdGVOYW1lKXtcclxuICAgICAgICByZWZlcnJhbC5uYW1lID0gdXBkYXRlTmFtZTtcclxuICAgICAgICBSZWZlcnJhbHMudXBkYXRlKCk7XHJcbiAgICAgICAgJHNjb3BlLnJlZnJlc2goKTtcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuc2V0VW5kZXJFZGl0aW9uID0gZnVuY3Rpb24gKHJlZmVycmFsKXtcclxuICAgICAgICBpZihyZWZlcnJhbCA9PT0gJHNjb3BlLnVuZGVyRWRpdGlvbil7XHJcbiAgICAgICAgICAgICRzY29wZS51bmRlckVkaXRpb24gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgJHNjb3BlLnVuZGVyRWRpdGlvbiA9IHJlZmVycmFsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gJGluamVjdDtcclxuIiwiLy8gaXQgYXNzdW1lcyB0aGF0IGFuZ3VsYXIgaXMgbG9hZGVkIGluZGVwZW5kZW50bHlcclxuKGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKFwiYW1iQXBwXCIsIFtcIm5nUm91dGVcIl0pO1xyXG5cclxuICAgIC8vQ09OVFJPTExFUlNcclxuICAgIGFwcC5jb250cm9sbGVyKFwiTWFpblBhbmVsQ3RybFwiLCByZXF1aXJlKFwiLi9tYWluLXBhbmVsLmN0cmwuanNcIikpO1xyXG4gICAgYXBwLmNvbnRyb2xsZXIoXCJMYW5kaW5nQ3RybFwiLCByZXF1aXJlKFwiLi9sYW5kaW5nLmN0cmwuanNcIikpO1xyXG5cclxuICAgIC8vIEZBQ1RPUklFU1xyXG4gICAgYXBwLmZhY3RvcnkoXCJSZWZlcnJhbHNcIiwgcmVxdWlyZShcIi4vcmVmZXJyYWxzLW1vY2suanNcIikpOyAvLyBjYW4gYmUgZWFzaWx5IHN1YnN0aXR1dGVkIHRvIHByb3BlciBvYmplY3RcclxuICAgIGFwcC5mYWN0b3J5KFwiYnVzeU5vdGlmaWVyXCIsIHJlcXVpcmUoXCIuL2J1c3ktbm90aWZpZXIuanNcIikpO1xyXG5cclxuICAgIC8vRElSRUNUSVZJRVNcclxuICAgIGFwcC5kaXJlY3RpdmUoXCJhbWJMb3VwZVwiLCByZXF1aXJlKFwiLi9hbWItbG91cGUuanNcIikpO1xyXG4gICAgYXBwLmRpcmVjdGl2ZShcImFtYkdldENlbnRlclwiLCByZXF1aXJlKFwiLi9hbWItZ2V0LWNlbnRlci5qc1wiKSk7XHJcblxyXG4gICAgLy8gQ09ORklHICYgUlVOXHJcbiAgICBhcHAuY29uZmlnKHJlcXVpcmUoXCIuL2NvbmZpZy5qc1wiKSk7XHJcbiAgICBhcHAucnVuKHJlcXVpcmUoXCIuL3J1bi5qc1wiKSk7XHJcbn0pKClcclxuIiwidmFyICRpbmplY3QgPSBbXCIkcVwiLCBcIiR0aW1lb3V0XCIsIFwiYnVzeU5vdGlmaWVyXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRxLCAkdGltZW91dCwgYnVzeU5vdGlmaWVyKXtcclxuXHJcbiAgICB2YXIgcmVmZXJyYWxzID0gbnVsbDtcclxuXHJcbiAgICBmdW5jdGlvbiBpbmNyZWFzZUNvdW50ZXIocmVmZXJyYWwpe1xyXG4gICAgICAgIHJlZmVycmFsLmNvdW50ZXIgPSByZWZlcnJhbC5jb3VudGVyICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjUpO1xyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiByZWFkQWxsKCl7XHJcbiAgICAgICAgcmVmZXJyYWxzID0gSlNPTi5wYXJzZSh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJyZWZlcnJhbHNcIikpO1xyXG4gICAgICAgIGlmKCFyZWZlcnJhbHMpe1xyXG4gICAgICAgICAgICByZWZlcnJhbHMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVmZXJyYWxzLmZvckVhY2goaW5jcmVhc2VDb3VudGVyKTtcclxuICAgICAgICB3cml0ZUFsbCgpO1xyXG4gICAgICAgIHJldHVybiByZWZlcnJhbHM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gd3JpdGVBbGwoKXtcclxuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJyZWZlcnJhbHNcIiwgSlNPTi5zdHJpbmdpZnkocmVmZXJyYWxzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgYWxsIDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcblxyXG4gICAgICAgICAgICBidXN5Tm90aWZpZXIuc2V0QnVzeSgpO1xyXG5cclxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGJ1c3lOb3RpZmllci5zZXROb3RCdXN5KCk7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlYWRBbGwoKSk7XHJcbiAgICAgICAgICAgIH0sIE1hdGgucmFuZG9tKCkqNzUwKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHBvc3QgOiBmdW5jdGlvbihuYW1lKSB7XHJcbiAgICAgICAgICAgIHJlZmVycmFscy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGlkIDogRGF0ZS5ub3coKSxcclxuICAgICAgICAgICAgICAgIG5hbWUgOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgY291bnRlciA6IDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHdyaXRlQWxsKCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgdXBkYXRlIDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgd3JpdGVBbGwoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBcImRlbGV0ZVwiIDogZnVuY3Rpb24oaWQpe1xyXG4gICAgICAgICAgICByZWZlcnJhbHMgPSByZWZlcnJhbHMuZmlsdGVyKGZ1bmN0aW9uKHJlZmVycmFsKXtcclxuICAgICAgICAgICAgICAgcmV0dXJuIHJlZmVycmFsLmlkICE9PSBpZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHdyaXRlQWxsKCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZXhpc3RzIDogZnVuY3Rpb24obmFtZSl7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcblxyXG4gICAgICAgICAgICBidXN5Tm90aWZpZXIuc2V0QnVzeSgpO1xyXG5cclxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHZhciBleGlzdHMgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHJlYWRBbGwoKTtcclxuICAgICAgICAgICAgICAgIHJlZmVycmFscy5mb3JFYWNoKGZ1bmN0aW9uKHJlZmVycmFsKXtcclxuICAgICAgICAgICAgICAgICAgIGlmKHJlZmVycmFsLm5hbWUgPT09IG5hbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGV4aXN0cyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGJ1c3lOb3RpZmllci5zZXROb3RCdXN5KCk7XHJcbiAgICAgICAgICAgICAgICBpZihleGlzdHMpe1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIE1hdGgucmFuZG9tKCkqNzUwKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMuJGluamVjdCA9ICRpbmplY3Q7XHJcbiIsInZhciAkaW5qZWN0ID0gW1wiJHJvb3RTY29wZVwiLFwiJGxvY2F0aW9uXCIsIFwiYnVzeU5vdGlmaWVyXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRyb290U2NvcGUsICRsb2NhdGlvbiwgYnVzeU5vdGlmaWVyKXtcclxuXHJcbiAgICAkcm9vdFNjb3BlLmJ1c3lOb3RpZmllciA9IGJ1c3lOb3RpZmllcjtcclxuXHJcbiAgICAkcm9vdFNjb3BlLiRvbihcIiRyb3V0ZUNoYW5nZUVycm9yXCIsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvXCIpO1xyXG4gICAgfSk7XHJcblxyXG59O1xyXG5tb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gJGluamVjdDtcclxuIl19
