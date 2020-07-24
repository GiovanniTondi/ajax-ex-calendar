/*
Creiamo un calendario dinamico con le festività.
Il calendario partirà da gennaio 2018 e si concluderà a dicembre 2018 (unici dati disponibili sull'API).

Milestone 1
Creiamo il mese di Gennaio, e con la chiamata all'API inseriamo le festività.

Milestone 2
Diamo la possibilità di cambiare mese, gestendo il caso in cui l'API non possa ritornare festività.

Attenzione!
Ogni volta che cambio mese dovrò:
Controllare se il mese è valido (per ovviare al problema che l'API non carichi holiday non del 2018)
Controllare quanti giorni ha il mese scelto formando così una lista
Chiedere all'api quali sono le festività per il mese scelto
Evidenziare le festività nella lista
*/

function printMonth(numMese) {

    if (!numMese) {
        numMese = 1;
    }

    var currMonth = moment("2018-" + numMese, "YYYY-M");
    var daysInMonth = moment(currMonth).daysInMonth();

    var template = $('#giorni-template').html();
    var compiled = Handlebars.compile(template);
    var target = $('#griglia');

    var mese = $('#mese');
    mese.find('span').text(currMonth.format('MMMM'));
    mese.attr('data-monthid', numMese);

    target.html('');

    for (var i = 1; i <= daysInMonth; i++) {

        var dateComplete = moment({
            year: currMonth.year(),
            month: currMonth.month(),
            day: i
        });

        var dayObj = compiled({
            'day': i,
            'dayOfWeek': dateComplete.format('ddd'),
            'dateComplete': dateComplete.format('YYYY-MM-DD')
        });
        target.append(dayObj);
    }

    addHolidays(currMonth);
}

function addHolidays(currMonth) {

    var year = moment(currMonth).year();
    var month = moment(currMonth).month();

    $.ajax({
        url: ' https://flynn.boolean.careers/exercises/api/holidays',
        method: 'GET',
        data: {
            'month': month,
            'year': year
        },
        success: function(data) {

            var success = data['success'];
            var holidays = data['response'];

            if (success) {

                for (var i = 0; i < holidays.length; i++) {
                    var elem = $('#griglia .day[data-dateComplete="' + holidays[i]['date'] + '"]');
                    elem.addClass('holiday');
                    elem.find('.holiday-name').text(holidays[i]['name']);
                }
            } else {
                console.log('NO DATA!');
            }

        },
        error: function (err) {
            console.log('Errore:', err);
        }
    });
}

function addClickListener() {

    $('#mese .fas').click(changeMonth);
}

function changeMonth() {

    var elem = $(this);
    var monthId = $('#mese').attr('data-monthid');

    if (elem.hasClass('left')) {

        if (monthId == 1) {
            monthId = 12;
        } else {
            monthId--;
        }

    } else if (elem.hasClass('right')) {
        if (monthId == 12) {
            monthId = 1;
        } else {
            monthId++;
        }
    }

    printMonth(monthId);
}

function init() {
    printMonth();
    addClickListener();
}

$(document).ready(init);
