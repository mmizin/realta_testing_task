function fn() {
    var LocalDate = Java.type('java.time.LocalDate');

    return {
        randomFutureStayDates: function(minDaysAhead, maxDaysAhead, stayLengthDays) {
            var offset = Math.floor(Math.random() * (maxDaysAhead - minDaysAhead)) + minDaysAhead;
            var checkin = LocalDate.now().plusDays(offset);
            var checkout = checkin.plusDays(stayLengthDays);
            return {
                checkin: checkin.toString(),
                checkout: checkout.toString()
            };
        }
    };
}
