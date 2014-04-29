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