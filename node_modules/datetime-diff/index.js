module.exports =
    function (dateFrom, dateTo){
        var seconds = -1;
        if (dateFrom != undefined && dateTo != undefined){
            var dif = dateFrom.getTime() - dateTo.getTime();
            seconds = Math.abs(dif / 1000);        
        }

        return {
            seconds : seconds,
            minutes :  seconds / 60,
            hours : seconds / 3600,
            days : seconds / (3600 * 24)
        }
    }    
