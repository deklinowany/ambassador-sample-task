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