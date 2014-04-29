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
