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
